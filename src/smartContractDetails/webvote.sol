// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Webvote {
    // candidate structure
    struct Candidate {
        uint256 candidateID;
        string candidateName;
        uint256 voteCount;
    }

    // candidate mapping to fetch candidates
    mapping(uint256 => Candidate) public candidates; // [1: {1, "Pooja", 0}...]

    // variables to handle candidates
    uint256 public candidateCount = 0; // increments when a new candidate is added//6
    uint256 private candidateCountrmv = 0; // maintains the count of removed/ deleted candidates//1
    uint256 public totalcand = 0; // stores total number of candidates (candidateCount - candidateCountrmv) 5

    // voters mapping to store the votes who already voted
    mapping(address => bool) public voters; //[0x00: false]

    // modifier for checking admin rights
    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    // admin/ the one who deployed the smart contract
    address public admin;

    // uint startTime;
    constructor() public {
        admin = msg.sender;
        addCandidate("NOTA");
        // stage = Stage.Registration;
        // startTime = block.timestamp;
    }

    // function to add candidates
    function addCandidate(string memory _name) public onlyAdmin {
        candidateCount++;
        totalcand = candidateCount - candidateCountrmv;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
    }

    // function to remove candidates
    function removeCandidate(uint256 _id) public onlyAdmin {
        candidateCountrmv++;
        totalcand = candidateCount - candidateCountrmv;
        delete candidates[_id];
    }

    // function to perform voting
    function vote(uint256 _toCandidateID) public {
        // restricting the person who already casted the vote
        require(!voters[msg.sender]);

        // require that the vote si casted to a valid contestant
        require(_toCandidateID > 0 && _toCandidateID <= candidateCount);

        // increase the contestant vote count
        candidates[_toCandidateID].voteCount++;

        // set the voter's voted status to true
        voters[msg.sender] = true;
    }
}
