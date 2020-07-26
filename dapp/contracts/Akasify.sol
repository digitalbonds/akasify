// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.7.0;
pragma experimental ABIEncoderV2;

/// @title Akasify
/// @author Nestor Bonilla
/// @notice Contract part of the Akasify DApp
/// @dev All function calls are currently implement without side effects

contract Akasify {
    /*_____________________________
     * 1. Variable Definitions
     *_____________________________
     */

    address public admin;

    uint256 nextOrganizationId = 0;
    uint256 nextOpportunityId = 0;
    uint256 nextApplicationId = 0;

    mapping(uint256 => Organization) organizations;
    mapping(uint256 => Opportunity) opportunities;
    mapping(address => mapping(uint256 => Application)) applications;
    mapping(address => bool) beneficiaries;

    struct Organization {
        uint256 id;
        string name;
        uint256 status;
        address[] accounts;
    }

    struct Opportunity {
        uint256 id;
        uint256 organizationId;
        string name;
        string description;
        uint256 creationDate;
        Requirement[] preRequirements;
        Requirement[] postRequirements;
        uint256 status;
    }

    struct Requirement {
        uint256 id;
        uint256 requirementType; //simple, value_required, automatic_transfer
        uint256 transferValue; //Zero by default, when stepType is automatic_transfer the value need to be higher than zero
        string name;
    }

    struct Application {
        uint256 id;
        uint256 opportunityId;
        uint256 signatureDate;
        uint256 currentStep;
        uint256 nextAccomplishmentId;
        Accomplishment[] accomplishments;
    }

    struct Accomplishment {
        uint256 id;
        uint256 stepId;
        uint256 accomplishDate;
        uint256 accomplishCategory; //started, finished
        string accomplishValue;
    }

    struct Validation {
        uint256 id;
        uint256 accomplishmentId;
        uint256 status;
        string message;
    }

    /*_____________________________
     * 2. Modifiers
     *_____________________________
     */

    modifier onlyAdmin() {
        require(msg.sender == admin, "only admin is allowed");
        _;
    }

    modifier onlyBeneficiary() {
        require(
            beneficiaries[msg.sender] == true,
            "only beneficiaries are allowed"
        );
        _;
    }

    modifier onlyOrganization() {
        require(
            beneficiaries[msg.sender] == true,
            "only beneficiaries are allowed"
        );
        _;
    }

    /*_____________________________
     * 3. Event Logs
     *_____________________________
     */

    /*_____________________________
     * 4. Function definition
     *_____________________________
     */

    constructor() public {
        admin = msg.sender;
        uint256[] memory _typeSteps = new uint256[](4);
        _typeSteps[0] = 1; //simple
        _typeSteps[1] = 2; //value_required
        _typeSteps[2] = 3; //automatic_transfer
        _typeSteps[3] = 2; //value_required
    }

    function deposit() external payable {}

    function createOrganization(
        string memory _name,
        uint256 _status,
        address _account
    ) public onlyAdmin() {
        organizations[nextOrganizationId].id = nextOrganizationId;
        organizations[nextOrganizationId].name = _name;
        organizations[nextOrganizationId].status = _status;
        organizations[nextOrganizationId].accounts.push(_account);
        nextOrganizationId++;
    }

    /// @notice Beneficiary adds its address to be able to create applications
    ///         to opportunities.
    function createBeneficiary(address _beneficiary) public {
        beneficiaries[_beneficiary] = true;
    }

    /// @notice Organizations create opportunities based on the previous agreement
    ///         with donors or supporting organizations.
    function createOpportunity(
        uint256 _organizationId,
        string memory _name,
        string memory _description,
        uint256 _creationDate,
        uint256 _status
    ) public onlyOrganization() {
        opportunities[nextOpportunityId].id = nextOpportunityId;
        opportunities[nextOpportunityId].organizationId = _organizationId;
        opportunities[nextOpportunityId].name = _name;
        opportunities[nextOpportunityId].description = _description;
        opportunities[nextOpportunityId].creationDate = now;
        opportunities[nextOpportunityId].status = _status;
        nextOpportunityId++;
    }

    /// @notice Beneficiaries create applications for opportunities created by organizations.
    function createApplication(
        uint256 _opportunityId,
        uint256 _signatureDate,
        uint256 _currentStep,
        uint256 _nextAccomplishmentId
    ) public onlyOrganization() {
        applications[msg.sender][nextApplicationId]
            .opportunityId = _opportunityId;
        applications[msg.sender][nextApplicationId]
            .signatureDate = _signatureDate;
        applications[msg.sender][nextApplicationId].currentStep = _currentStep;
        applications[msg.sender][nextApplicationId]
            .nextAccomplishmentId = _nextAccomplishmentId;
        nextApplicationId++;
    }
}
