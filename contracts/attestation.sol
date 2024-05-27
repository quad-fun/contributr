// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ContributionAttestation is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _attestationIds;

    struct Attestation {
        uint256 id;
        string repo;
        string commitHash;
        string author;
        uint256 timestamp;
    }

    mapping(uint256 => Attestation) public attestations;

    event AttestationCreated(uint256 id, string repo, string commitHash, string author, uint256 timestamp);

    constructor() {}

    function createAttestation(string memory repo, string memory commitHash, string memory author) public onlyOwner {
        _attestationIds.increment();
        uint256 newId = _attestationIds.current();

        Attestation memory newAttestation = Attestation({
            id: newId,
            repo: repo,
            commitHash: commitHash,
            author: author,
            timestamp: block.timestamp
        });

        attestations[newId] = newAttestation;

        emit AttestationCreated(newId, repo, commitHash, author, block.timestamp);
    }

    function getAttestation(uint256 id) public view returns (Attestation memory) {
        return attestations[id];
    }
}
