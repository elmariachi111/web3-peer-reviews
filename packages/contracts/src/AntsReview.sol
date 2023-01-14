/// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.13;
pragma experimental ABIEncoderV2;

/// @title Ants-Review
/// @author Nazzareno Massari @naszam - modified by Jan Ole Ernst
/// @notice AntsReview to allows issuer to issue an antReview which peer-reviewers can fulfill
/// @dev All function calls are currently implemented without side effects through TDD approach
/// @dev OpenZeppelin library is used for secure contract development

/**
 * █████  ███    ██ ████████ ███████       ██████  ███████ ██    ██ ██ ███████ ██     ██
 * ██   ██ ████   ██    ██    ██            ██   ██ ██      ██    ██ ██ ██      ██     ██
 * ███████ ██ ██  ██    ██    ███████ █████ ██████  █████   ██    ██ ██ █████   ██  █  ██
 * ██   ██ ██  ██ ██    ██         ██       ██   ██ ██       ██  ██  ██ ██      ██ ███ ██
 * ██   ██ ██   ████    ██    ███████       ██   ██ ███████   ████   ██ ███████  ███ ███
 *
 *
 */

import "./AntsReviewRoles.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract AntsReview is AntsReviewRoles {
  using SafeMath for uint256;
  using Address for address payable;
  using Counters for Counters.Counter;
  using EnumerableSet for EnumerableSet.AddressSet;

  /// @dev Enums
  enum AntReviewStatus {
    CREATED,
    PAID
  }

  /// @dev Counter
  Counters.Counter public antReviewIdTracker;

  /// @dev Storage
  mapping(uint256 => AntReview) public antreviews;
  mapping(uint256 => Peer_Review[]) public peer_reviews;
  mapping(uint256 => Contribution[]) public contributions;
  mapping(uint256 => EnumerableSet.AddressSet) private approvers;

  /// @dev Structs
  struct AntReview {
    address payable[] issuers;
    string paperHash;
    string topicsHash;
    uint256 deadline;
    AntReviewStatus status;
    uint256 balance;
  }

  struct Peer_Review {
    bool accepted;
    address payable peer_reviewer;
    string reviewHash;
  }

  struct Contribution {
    address payable contributor;
    uint256 amount;
    bool refunded;
  }

  /// @dev Events

  event AntReviewIssued(
    uint256 antId, address payable[] issuers, string paperHash, string topicsHash, uint64 deadline
  );
  event ContributionAdded(
    uint256 antId, uint256 contributionId, address contributor, uint256 amount
  );
  event ContributionRefunded(uint256 antId, uint256 contributionId, address contributor);
  event AntReviewFulfilled(
    uint256 antId, uint256 reviewId, address peer_reviewer, string reviewHash
  );
  event ReviewUpdated(uint256 antId, uint256 reviewId, string reviewHash);
  event AntReviewAccepted(uint256 antId, uint256 reviewId, address approver, uint256 amount);
  event AntReviewChanged(
    uint256 antId,
    address issuer,
    address payable[] issuers,
    string paperHash,
    string topicsHash,
    uint64 deadline
  );
  event ApproverAdded(uint256 antId, uint256 issuerId, address approver);
  event ApproverRemoved(uint256 antId, uint256 issuerId, address approver);
  event AntReviewWithdrawn(uint256 antId, address issuer, uint256 amount, uint256 balance);

  constructor(address orcidContract) {
    _setupRole(DEFAULT_ADMIN_ROLE, owner());
    _setupRole(PAUSER_ROLE, owner());
    orcid = Orcid(orcidContract);
  }

  /// @dev Fallback

  fallback() external {
    revert();
  }

  /// @dev Modifiers

  modifier antReviewExists(uint256 _antId) {
    require(_antId <= antReviewIdTracker.current());
    _;
  }

  modifier reviewExists(uint256 _antId, uint256 _reviewId) {
    require(_reviewId < peer_reviews[_antId].length);
    _;
  }

  modifier hasStatus(uint256 _antId, AntReviewStatus _desiredStatus) {
    require(antreviews[_antId].status == _desiredStatus);
    _;
  }

  modifier validateDeadline(uint256 _deadline) {
    require(_deadline > block.timestamp);
    _;
  }

  modifier isBeforeDeadline(uint256 _antId) {
    require(block.timestamp < antreviews[_antId].deadline);
    _;
  }

  modifier onlyContributor(uint256 _antId, uint256 _contributionId) {
    require(
      msg.sender == contributions[_antId][_contributionId].contributor,
      "Caller is not a Contributor"
    );
    _;
  }

  modifier hasNotPaid(uint256 _antId) {
    require(antreviews[_antId].status != AntReviewStatus.PAID);
    _;
  }

  modifier hasNotRefunded(uint256 _antId, uint256 _contributionId) {
    require(!contributions[_antId][_contributionId].refunded);
    _;
  }

  modifier onlySubmitter(uint256 _antId, uint256 _reviewId) {
    require(
      msg.sender == peer_reviews[_antId][_reviewId].peer_reviewer, "Caller is not the submitter"
    );
    _;
  }

  modifier onlyApprover(uint256 _antId) {
    require(approvers[_antId].contains(msg.sender), "Caller is not the approver");
    _;
  }

  modifier hasIssuer(uint256 _antId, uint256 _issuerId) {
    require(antreviews[_antId].issuers[_issuerId] == msg.sender, "Caller is not the issuer");
    _;
  }

  /// @dev Getters

  function getApprover(uint256 _antId, uint256 _approverId)
    external
    view
    whenNotPaused
    returns (address approver)
  {
    return approvers[_antId].at(_approverId);
  }

  /// @notice Create a new AntReview
  /// @dev anyone can call this function as long as the have a linked ORCID ID
  /// @param _issuers The issuers of the AntReview
  /// @param _approver The approver of the AntReview
  /// @param _paperHash The IPFS Hash of the Scientific Paper
  /// @param _topicsHash The IPFS Hash of the paper key topics
  /// @param _deadline The unix timestamp after which fulfillments will no longer be accepted
  /// @return True If the AntReview is successfully issued
  function issueAntReview(
    address payable[] calldata _issuers,
    address _approver,
    string calldata _paperHash,
    string calldata _topicsHash,
    uint64 _deadline
  ) external validateDeadline(_deadline) whenNotPaused returns (bool) {
    uint256 antId = antReviewIdTracker.current();

    AntReview storage newAntReview = antreviews[antId];

    newAntReview.issuers = _issuers;
    newAntReview.paperHash = _paperHash;
    newAntReview.topicsHash = _topicsHash;
    newAntReview.deadline = _deadline;
    newAntReview.status = AntReviewStatus.CREATED;

    //require(bytes(orcid.addressToOrcid(_issuers)).length != 0, "Your account must be linked to an ORCID to issue a peer review request");
    require(_addApprover(antId, _approver));

    antReviewIdTracker.increment();

    emit AntReviewIssued(antId, _issuers, _paperHash, _topicsHash, _deadline);

    return true;
  }

  /// @notice Change an AntReview
  /// @dev Access restricted to Issuer
  /// @param _antId The AntReview Id
  /// @param _issuerId The Issuer Id
  /// @param _issuers The issuers of the AntReview
  /// @param _paperHash The IPFS Hash of the Scientific Paper
  /// @param _topicsHash The IPFS Hash of the paper key topics
  /// @param _deadline The unix timestamp after which fulfillments will no longer be accepted
  /// @return True If the AntReview is successfully changed
  function changeAntReview(
    uint256 _antId,
    uint256 _issuerId,
    address payable[] calldata _issuers,
    string calldata _paperHash,
    string calldata _topicsHash,
    uint64 _deadline
  ) external hasIssuer(_antId, _issuerId) whenNotPaused returns (bool) {
    antreviews[_antId].issuers = _issuers;
    antreviews[_antId].paperHash = _paperHash;
    antreviews[_antId].topicsHash = _topicsHash;
    antreviews[_antId].deadline = _deadline;

    emit AntReviewChanged(_antId, msg.sender, _issuers, _paperHash, _topicsHash, _deadline);
    return true;
  }

  /// @notice Add Approver
  /// @dev Internal function used in issueAntReview()
  /// @param _antId The AntReview Id
  /// @param _account The account to be added as Approver
  /// @return True if the account is successfully added as Approver
  function _addApprover(uint256 _antId, address _account) private whenNotPaused returns (bool) {
    return approvers[_antId].add(_account);
  }

  /// @notice Add Approver
  /// @dev Access restricted to Issuers and Accessor must have linked ORCID ID
  /// @param _antId The AntReview Id
  /// @param _issuerId The Issuer Id
  /// @param _account The account to be added as Approver
  /// @return True if the account is successfully added as Approver
  function addApprover(uint256 _antId, uint256 _issuerId, address _account)
    external
    antReviewExists(_antId)
    hasIssuer(_antId, _issuerId)
    whenNotPaused
    returns (bool)
  {
    require(!approvers[_antId].contains(_account), "Account is already an approver");
    require(bytes(orcid.addressToOrcid(_account)).length != 0, "Address not connected to ORCID");
    require(approvers[_antId].add(_account));
    emit ApproverAdded(_antId, _issuerId, _account);
    return true;
  }

  /// @notice Remove Approver
  /// @dev Access restricted to Issuers
  /// @param _antId The AntReview Id
  /// @param _issuerId The Issuer Id
  /// @param _account The account to be removed as Approver
  /// @return True if the account is successfully removed as Approver
  function removeApprover(uint256 _antId, uint256 _issuerId, address _account)
    external
    antReviewExists(_antId)
    hasIssuer(_antId, _issuerId)
    whenNotPaused
    returns (bool)
  {
    require(approvers[_antId].contains(_account), "Account is not an approver");
    require(approvers[_antId].remove(_account));
    emit ApproverRemoved(_antId, _issuerId, _account);
    return true;
  }

  /// @notice Contribute to an AntReview
  /// @param _antId The AntReview Id
  /// @return True if the account is the contribution is successfully added
  function contribute(uint256 _antId)
    external
    payable
    antReviewExists(_antId)
    whenNotPaused
    returns (bool)
  {
    uint256 _amount = msg.value;
    require(_amount > 0, "Please be more generous");

    contributions[_antId].push(Contribution(payable(msg.sender), _amount, false));
    antreviews[_antId].balance = antreviews[_antId].balance.add(_amount);

    emit ContributionAdded(_antId, contributions[_antId].length.sub(1), msg.sender, _amount);

    return true;
  }

  /// @notice Refund Contributors
  /// @dev Access restricted to Contributor
  /// @param _antId The AntReview Id
  /// @param _contributionId The Contribution Id
  /// @return True if the contribution is successfully refunded
  function refund(uint256 _antId, uint256 _contributionId)
    external
    antReviewExists(_antId)
    onlyContributor(_antId, _contributionId)
    hasNotPaid(_antId)
    hasNotRefunded(_antId, _contributionId)
    whenNotPaused
    returns (bool)
  {
    require(block.timestamp > antreviews[_antId].deadline, "Deadline has not elapsed");

    Contribution storage contribution = contributions[_antId][_contributionId];

    contribution.refunded = true;
    antreviews[_antId].balance = antreviews[_antId].balance.sub(contribution.amount);

    payable(contribution.contributor).transfer(contribution.amount);

    emit ContributionRefunded(_antId, _contributionId, msg.sender);

    return true;
  }

  /// @notice Submits a peer review for the given antReview
  /// @dev Access unrestricted
  /// @param _antId The AntReview Id
  /// @param _reviewHash The IPFS Hash of the peer-review
  /// @return True If the AntReview is successfully fulfilled
  function submitPeerReview(uint256 _antId, string calldata _reviewHash)
    external
    antReviewExists(_antId)
    hasStatus(_antId, AntReviewStatus.CREATED)
    isBeforeDeadline(_antId)
    whenNotPaused
    returns (bool)
  {
    peer_reviews[_antId].push(Peer_Review(false, payable(msg.sender), _reviewHash));

    emit AntReviewFulfilled(_antId, peer_reviews[_antId].length.sub(1), msg.sender, _reviewHash);
    return true;
  }

  /// @notice Update AntReview
  /// @dev Access restricted to Peer_Reviewers
  /// @param _antId The AntReview Id
  /// @param _reviewId The Peer_Review Id
  /// @param _reviewHash The IPFS Hash of the updated Peer_Review
  /// @return True If the Peer_Review is successfully updated
  function updateReview(uint256 _antId, uint256 _reviewId, string calldata _reviewHash)
    external
    onlySubmitter(_antId, _reviewId)
    reviewExists(_antId, _reviewId)
    hasStatus(_antId, AntReviewStatus.CREATED)
    isBeforeDeadline(_antId)
    whenNotPaused
    returns (bool)
  {
    peer_reviews[_antId][_reviewId].reviewHash = _reviewHash;

    emit ReviewUpdated(_antId, _reviewId, _reviewHash);
    return true;
  }

  /// @notice Allows Approvers to accept a peer review
  /// @dev Access restricted to Approver
  /// @param _antId The AntReview Id
  /// @param _reviewId The Peer_Review Id
  /// @return True If the AntReview is successfully being accepted
  function acceptAntReview(uint256 _antId, uint256 _reviewId, uint256 _amount)
    external
    onlyApprover(_antId)
    reviewExists(_antId, _reviewId)
    hasStatus(_antId, AntReviewStatus.CREATED)
    whenNotPaused
    returns (bool)
  {
    require(
      peer_reviews[_antId][_reviewId].accepted == false, "this peer review already is accepted"
    );
    peer_reviews[_antId][_reviewId].accepted = true;

    antreviews[_antId].status = AntReviewStatus.PAID;
    antreviews[_antId].balance = antreviews[_antId].balance.sub(_amount);

    payable(peer_reviews[_antId][_reviewId].peer_reviewer).transfer(_amount);

    emit AntReviewAccepted(_antId, _reviewId, msg.sender, _amount);
    return true;
  }

  ///todo: well. After the deadline has passed, ANY issuer (coauthor)
  ///todo: may withdraw ANY amount from the contribution funds
  ///todo: that means that we just have to wait until the deadline passes and can get all the contributor's money without having any peer review to pass :D
  /// @notice Withdraw AntReview
  /// @dev Access restricted to Issuer
  /// @param _antId The AntReview Id
  /// @param _issuerId The Issuer Id
  /// @param _amount The amount to withdraw
  /// @return True If the AntReview is successfully withdrawn
  function withdrawAntReview(uint256 _antId, uint256 _issuerId, uint256 _amount)
    external
    antReviewExists(_antId)
    hasIssuer(_antId, _issuerId)
    whenNotPaused
    returns (bool)
  {
    require(block.timestamp > antreviews[_antId].deadline, "Deadline has not elapsed");
    require(antreviews[_antId].balance >= _amount, "Amount exceeds AntReview balance");

    antreviews[_antId].balance = antreviews[_antId].balance.sub(_amount);

    payable(msg.sender).transfer(_amount);
    emit AntReviewWithdrawn(_antId, msg.sender, _amount, antreviews[_antId].balance);
    return true;
  }
}
