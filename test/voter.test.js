const VotingSystem = artifacts.require("VotingSystem");

contract("VotingSystem", (accounts) => {
    let votingSystem;
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const candidateId = 1;

    beforeEach(async () => {
        votingSystem = await VotingSystem.new({ from: owner });
    });

    it("should allow the owner to register voters", async () => {
        await votingSystem.registerVoter(voter1, { from: owner });
        const isVoterRegistered = await votingSystem.registeredVoters.call(voter1);
        assert.isTrue(isVoterRegistered, "Owner should be able to register voters");
    });

    it("should only allow the contract owner to register voters", async () => {
        try {
            await votingSystem.registerVoter(voter2, { from: voter1 });
            assert.fail("Non-owner should not be able to register voters");
        } catch (error) {
            assert(error.message.includes("Only the owner can perform this action"), "Expected an error message");
        }
    });

    it("should allow registered voters to cast their votes", async () => {
        await votingSystem.registerVoter(voter1, { from: owner });
        await votingSystem.vote(candidateId, { from: voter1 });
        const voteCount = await votingSystem.getCurrentVoteCount.call(candidateId);
        assert.equal(voteCount, 1, "Vote count should increase after voting");
    });

    it("should only allow registered voters to vote", async () => {
        try {
            await votingSystem.vote(candidateId, { from: accounts[3] });
            assert.fail("Non-registered voter should not be able to vote");
        } catch (error) {
            assert(error.message.includes("You are not a registered voter"), "Expected an error message");
        }
    });

    it("should not allow a registered voter to vote more than once", async () => {
        await votingSystem.registerVoter(voter1, { from: owner });
        await votingSystem.vote(candidateId, { from: voter1 });

        try {
            await votingSystem.vote(candidateId, { from: voter1 });
            assert.fail("Registered voter should not be able to vote more than once");
        } catch (error) {
            assert(error.message.includes("You have already voted"), "Expected an error message");
        }
    });
});
