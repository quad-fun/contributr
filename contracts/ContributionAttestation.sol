// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Contract for managing contribution attestations
contract ContributionAttestation is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _attestationIdCounter; // Counter for generating unique attestation IDs

    // Struct to represent an attestation
    struct Attestation {
        uint256 id;
        string repo;
        string commitHash;
        string author;
    }

    // Mapping to store attestations by their ID
    mapping(uint256 => Attestation) public attestations;

    // Event to be emitted when a new attestation is created
    event AttestationCreated(uint256 id, string repo, string commitHash, string author);

    // Constructor to initialize the contract with the owner address
    constructor(address initialOwner) Ownable() {
        transferOwnership(initialOwner); // Transfer ownership to the specified initial owner
    }

    // Function to create a new attestation
    function createAttestation(string memory repo, string memory commitHash, string memory author) public onlyOwner {
        _attestationIdCounter.increment(); // Increment the attestation ID counter
        uint256 newAttestationId = _attestationIdCounter.current(); // Get the current attestation ID
        // Store the new attestation in the mapping
        attestations[newAttestationId] = Attestation(newAttestationId, repo, commitHash, author);
        // Emit the AttestationCreated event
        emit AttestationCreated(newAttestationId, repo, commitHash, author);
    }

    // Function to retrieve an attestation by its ID
    function getAttestation(uint256 id) public view returns (Attestation memory) {
        return attestations[id];
    }
}
