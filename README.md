## P33R Review

This protocol proposes a decentralised peer-review system to address the challenges of the current peer-review system for both scientific research papers and grants. Challenges include a lack of transparency and accountability, and more importantly a lack of adequate incentives for reviewers which can lead to lengthy delays that may plague the entire process. The proposed system incentivizes reviewers by providing adequate rewards, both financial and reputational. The peer-review process is open to any verified reviewer, attested through composable research profiles underpinned by ORCID-ETH link verification. 

The decentralised reviewing system is based on an optimised [Ants Review](https://github.com/naszam/ants-review) (you can check out the original AntsReview contracts on their repository) smart contract suite which is linked to the [OrcidAuth](https://orcidauth.vercel.app) contract and anchors review submission requests on the blockchain. It mentions the paper under review with a document identifier, such as an IPFS link, alongside a staked token reward for review completion (however small it may be). The idea is that external funders can contribute to the reward pool ahead of release on the successful completion of the review to fund the review of work deemed important.  In particular these could be research grantees, industry players, philanthropists or even journals in the future.

The peer-review process is open for any verified reviewer, for a larger proportion of the reward pool, or as a review approver, for a smaller proportion. The reviewer identity is not publicly revealed, with only an undisclosed address appearing on the blockchain, whilst the issuer and approver identities, as well as the initial paper and reviewer comments are visible on the blockchain with CID’s. The approver is generally similar to an editor and must display some level of seniority or experience, which in a more mature on-chain peer review system can be verified by a metric such as the number of successful peer reviews that the potential approver has carried out.  

The attestation of reviewer and approver credentials are guaranteed by their public profile and ORCID-ETH link. Once the reviewer submits their comments and decision, an approver can check the validity of the review, check for collusion and also look at the reviewer credentials.  The reviewer must send the approver an off-chain message with their identity to avoid public disclosure. In our simple demonstration the reviewer has control of two addresses, one which is linked to ORCID and one which is anonymous. On-Chain activity is carried out with the anonymous address and a hash of the ORCID address and the anon address is added to the review submission which allows the reviewers to prove retroactively their authorship of that particular on-chain commitment.  The hash would look as follows: keccak( sig(anon -> private) + sig(private -> anon)).Their ORCID address is privately disclosed to the approver who can verify the reviewers identity and credentials by checking against the hash that is published on chain. In future, this proof of research credentials can be optimised with a zero knowledge proof. Subsequently, the approver is tasked with checking for a conflict of interest (later iterations may seek to automate this process).  The peer reviewer is able to prove to others that they have filed a successful peer review by revealing control over the initial commitment.

This protocol is designed for secure and transparent peer-review that allows researchers to appraise and challenge scientific work in a decentralised way, whilst adequately rewarding reviewers. This protocol works both for standard paper peer review, as well as for proposals requesting funding. For the latter, the issuer (as well as possible other third parties) provide a certain amount of funds which shall be distributed retroactively (cf. Retroactive Public Goods Funding) or proactively to a number of nominated projects in a particular research area. The peer reviewers act as expert judges as to where to assign funds. A small share of the distributed funds will then be distributed to the reviewers to reward them for their work.

# App based on an opinionated scaffold for web3 hackathon projects

typescript  
yarn monorepo with packages and apps  
foundry ~~hardhat~~   
typechain  
oz erc721 base impl

nextjs / react  
chakraui 2  
ethers.js  
wagmi.sh  
rainbowkit  

## 2023 update

inspired by https://github.com/bigstair-monorepo/monorepo / https://www.robinwieruch.de/javascript-monorepos/ and https://dev.to/mxro/the-ultimate-guide-to-typescript-monorepos-5ap7
