// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

//test comment

// Import the contract to be tested
import "../contracts/ContributionAttestation.sol";
import "remix_tests.sol"; // Import the Remix testing library

// Define the test contract
contract ContributionAttestationTest {
    
    // Create an instance of the contract to be tested
    ContributionAttestation contributionAttestation;
    
    // Define the deployer address for the Ownable constructor
    address owner = address(this);
    
    // Before each test, deploy a new instance of the contract
    function beforeEach() public {
        contributionAttestation = new ContributionAttestation(owner);
    }
    
    // Test the creation of an attestation
    function testCreateAttestation() public {
        // Create a new attestation
        contributionAttestation.createAttestation("repo1", "commitHash1", "author1");
        
        // Retrieve the attestation
        ContributionAttestation.Attestation memory attestation = contributionAttestation.getAttestation(1);
        
        // Assert that the attestation details are correct
        Assert.equal(attestation.repo, "repo1", "Repo does not match");
        Assert.equal(attestation.commitHash, "commitHash1", "Commit hash does not match");
        Assert.equal(attestation.author, "author1", "Author does not match");
    }
}
