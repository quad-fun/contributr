const { expect } = require("chai");

describe("ContributionAttestation", function () {
  let ContributionAttestation, contributionAttestation, owner;

  before(async function () {
    [owner] = await ethers.getSigners();
    ContributionAttestation = await ethers.getContractFactory("ContributionAttestation");
    contributionAttestation = await ContributionAttestation.deploy();
    await contributionAttestation.deployed();
  });

  it("should create a new attestation", async function () {
    await contributionAttestation.createAttestation("repo1", "commitHash1", "author1");
    const attestation = await contributionAttestation.getAttestation(1);
    expect(attestation.repo).to.equal("repo1");
    expect(attestation.commitHash).to.equal("commitHash1");
    expect(attestation.author).to.equal("author1");
  });
});
