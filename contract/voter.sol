// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title Voting System Smart Contract
/// @notice This contract allows for the registration of voters and the casting of votes for multiple candidates.
contract VotingSystem {
    address private owner;
    mapping(address => bool) private registeredVoters;
    mapping(address => bool) private hasVoted;
    mapping(uint256 => uint256) public voteCounts;

    /// @dev The contract owner is set to the address that deploys the contract.
    constructor() {
        owner = msg.sender;
    }

    /// @dev Modifier to restrict access to the contract owner only.
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    /// @dev Modifier to restrict access to registered voters only.
    modifier onlyRegisteredVoter() {
        require(registeredVoters[msg.sender], "You are not a registered voter");
        _;
    }

    /// @notice Allows the contract owner to register a new voter.
    /// @dev Only the contract owner can register new voters.
    /// @param _voter The address of the new voter to be registered.
    function registerVoter(address _voter) public onlyOwner {
        require(!registeredVoters[_voter], "Voter is already registered");
        registeredVoters[_voter] = true;
    }

    /// @notice Allows a registered voter to cast their vote for a candidate.
    /// @dev Only registered voters can cast their votes, and each voter can vote only once.
    /// @param _candidateId The ID of the candidate the voter is voting for.
    function vote(uint256 _candidateId) public onlyRegisteredVoter {
        require(!hasVoted[msg.sender], "You have already voted");
        hasVoted[msg.sender] = true;
        voteCounts[_candidateId]++;
    }

    /// @notice Retrieves the current vote count for a specific candidate.
    /// @param _candidateId The ID of the candidate to get the vote count for.
    /// @return The current vote count for the specified candidate.
    function getCurrentVoteCount(uint256 _candidateId) public view returns (uint256) {
        return voteCounts[_candidateId];
    }
}
