//pragma solidity >=0.6.0 <0.7.0;
pragma solidity >=0.6.6;
pragma experimental ABIEncoderV2;
// SPDX-License-Identifier: MIT

import "hardhat/console.sol";

contract AkasifyCoreContract {

    struct Organization {
        uint id;
        string name;
        address payable account;
        uint registerDate;
        uint status;
    }

    struct Beneficiary {
        uint id;
        address payable account;
        uint registerDate;
        uint status;
    }

    struct Opportunity {
        uint id;
        uint organizationId;
        string name;
        string description;
        uint creationDate;
        uint preRequirementsDeadline;
        uint postRequirementsDeadline;
        uint lastUpdate;
        uint status;
        //1. draft
        //2. open to applications
        //3. reviewing applications
        //4. applications selected
        //5. opportunity initiated
        //6. opportunity finalized
        //7. postRequirements concluded
        uint nextPreRequirementId;
        uint nextPostRequirementId;
        mapping(uint => Requirement) preRequirements;
        mapping(uint => Requirement) postRequirements;
    }

    struct Requirement {
        uint id;
        uint requirementType;           //simple, value_required, automatic_transfer
        uint transferValue;             //zero by default, when stepType is automatic_transfer the value need to be higher than zero
        string name;
    }

    struct Application {
        uint id;
        uint opportunityId;
        uint beneficiaryId;
        uint nextPreRequirementId;
        uint nextPostRequirementId;
        uint nextPreAccomplishmentId;
        uint nextPostAccomplishmentId;
        uint status;
        //1. preRequirements started => beneficiary
        //2. preRequirements finalized => beneficiary
        //3. application approved => organization
        //4. application rejected => organization
        //5. postRequirement started => organization
        //6. postRequirement finalized => beneficiary
        //7. application complete => organization
        //8. application incomplete => organization
        Accomplishment[] preAccomplishments;
        Accomplishment[] postAccomplishments;
    }

    struct Accomplishment {
        uint id;
        uint requirementId;
        uint accomplishDate;
        uint accomplishCategory;        //started, finished
        string accomplishValue;
    }

    mapping(uint => Beneficiary) beneficiaries;
    uint public nextBeneficiaryId;

    mapping(uint => Organization) organizations;
    uint public nextOrganizationId;

    mapping(uint => Opportunity) public opportunities;
    uint public nextOpportunityId;

    mapping(uint => Application) public applications;
    uint public nextApplicationId;

    address public admin;

    //events
    event OpportunityCreated(uint id, string name, string description);
    event OpportunityStatusUpdated(uint id, uint status);
    event ApplicationCreated(uint id, uint opportunityId);
    event ApplicationStatusUpdated(uint id, uint status);
    event ApplicationPreAccomplishmentCreated(uint id, uint requirementId, uint accomplishDate, uint accomplishCategory, uint accomplishValue);
    event ApplicationPostAccomplishmentCreated(uint id, uint requirementId, uint accomplishDate, uint accomplishCategory, uint accomplishValue);

    constructor(address _admin) public {
        admin = _admin;
    }

    function getRole(address account) public view returns(string memory) {
        //verifying role of account
        if(admin == account) {
            return 'admin';
        } else if(isOrganization(account) == true) {
            return 'organization';
        } else if(isBeneficiary(account) == true) {
            return 'beneficiary';
        } else {
            return 'visitor';
        }
    }

    function registerOrganizationByAdmin(
        string memory name,
        address payable account,
        uint status
    ) public onlyAdmin() returns(uint) {
        uint _newId = nextOrganizationId;
        organizations[nextOrganizationId] = Organization(
            nextOrganizationId,
            name,
            account,
            now,
            status
        );
        nextOrganizationId++;
        return _newId;
    }

    function getOrganizations()
        public view returns(uint[] memory, string[] memory, address[] memory, uint[] memory, uint[] memory) {

        uint[] memory ids = new uint[](nextOrganizationId);
        string[] memory names = new string[](nextOrganizationId);
        address[] memory accounts = new address[](nextOrganizationId);
        uint[] memory registerDates = new uint[](nextOrganizationId);
        uint[] memory status = new uint[](nextOrganizationId);

        for (uint i = 0; i < nextOrganizationId; i++) {
            Organization memory _organization = organizations[i];
            ids[i] = _organization.id;
            names[i] = _organization.name;
            accounts[i] = _organization.account;
            registerDates[i] = _organization.registerDate;
            status[i] = _organization.status;
        }
        return (ids, names, accounts, registerDates, status);
    }
    
    function getOrganizationById(uint _id)
        public view returns(uint, string memory, address, uint, uint) {
        Organization memory _organization = organizations[_id];
        return (_organization.id, _organization.name, _organization.account, _organization.registerDate, _organization.status); 
    }

    function getOrganizationByAddress(address _account)
        public view returns(uint, string memory, address, uint, uint) {
        for (uint i = 0; i < nextOrganizationId; i++) {    
            Organization memory _organization = organizations[i];
            if (_organization.account == _account) {
                return (_organization.id, _organization.name, _organization.account, _organization.registerDate, _organization.status);          
            }
        }
        return (0, "", 0x0000000000000000000000000000000000000000, 0, 0);
    }

    function registerBeneficiaryByAdmin(
        address payable account,
        uint status
    ) public onlyAdmin() {
        beneficiaries[nextBeneficiaryId] = Beneficiary(
            nextBeneficiaryId,
            account,
            now,
            status
        );
        nextBeneficiaryId++;
    }

    function registerBeneficiary() public notAdmin() notOrganization() {
        beneficiaries[nextBeneficiaryId] = Beneficiary(
            nextBeneficiaryId,
            msg.sender,
            now,
            1
        );
        nextBeneficiaryId++;
    }

    function getBeneficiaries()
        public view returns(uint[] memory, address[] memory, uint[] memory, uint[] memory) {

        uint[] memory ids = new uint[](nextBeneficiaryId);
        address[] memory accounts = new address[](nextBeneficiaryId);
        uint[] memory registerDates = new uint[](nextBeneficiaryId);
        uint[] memory status = new uint[](nextBeneficiaryId);

        for (uint i = 0; i < nextBeneficiaryId; i++) {
            Beneficiary memory _beneficiary = beneficiaries[i];
            ids[i] = _beneficiary.id;
            accounts[i] = _beneficiary.account;
            registerDates[i] = _beneficiary.registerDate;
            status[i] = _beneficiary.status;
        }
        return (ids, accounts, registerDates, status);
    }

    function getBeneficiaryById(uint _id)
        public view returns(uint, address, uint, uint) {
        Beneficiary memory _beneficiary = beneficiaries[_id];
        return (_beneficiary.id, _beneficiary.account, _beneficiary.registerDate, _beneficiary.status); 
    }

    function getBeneficiaryByAddress(address _account)
        public view returns(uint, address, uint, uint) {
        for (uint i = 0; i < nextBeneficiaryId; i++) {    
            Beneficiary memory _beneficiary = beneficiaries[i];        
            if (_beneficiary.account == _account) {
                return (_beneficiary.id, _beneficiary.account, _beneficiary.registerDate, _beneficiary.status);          
            }
        }
        return (0, 0x0000000000000000000000000000000000000000, 0, 0);
    }

    function createOpportunity(
        string memory name,
        string memory description,
        uint preRequirementsDeadline,
        uint postRequirementsDeadline,
        uint[] memory preRequirementTypes,
        uint[] memory preRequirementValues,
        string[] memory preRequirementNames,
        uint[] memory postRequirementTypes,
        uint[] memory postRequirementValues,
        string[] memory postRequirementNames
    ) public onlyOrganization() {
        require(bytes(name).length > 0, 'name is empty');
        require(bytes(description).length > 0, 'description is empty');
        // validate preRequirementTypes, preRequirementValues and preRequirementNames have the same length
        require((preRequirementTypes.length ==  preRequirementValues.length) && (preRequirementValues.length == preRequirementNames.length), 'pre requirement values number must have the same length');
        // validate postRequirementTypes, postRequirementValues and postRequirementNames have the same length
        require((postRequirementTypes.length ==  postRequirementValues.length) && (postRequirementValues.length == postRequirementNames.length), 'post requirement values number must have the same length');

        opportunities[nextOpportunityId].id = nextOpportunityId;
        opportunities[nextOpportunityId].organizationId = getOrganizationIdByAddress(msg.sender);
        opportunities[nextOpportunityId].name = name;
        opportunities[nextOpportunityId].description = description;        
        opportunities[nextOpportunityId].creationDate = now;
        opportunities[nextOpportunityId].preRequirementsDeadline = preRequirementsDeadline;
        opportunities[nextOpportunityId].postRequirementsDeadline = postRequirementsDeadline;
        opportunities[nextOpportunityId].lastUpdate = now;
        opportunities[nextOpportunityId].status = 1;

        //adding pre requirements
        for(uint i = 0; i < preRequirementTypes.length; i++) {
            opportunities[nextOpportunityId].preRequirements[opportunities[nextOpportunityId].nextPreRequirementId] = Requirement(
                opportunities[nextOpportunityId].nextPreRequirementId,
                preRequirementTypes[i],
                preRequirementValues[i],
                preRequirementNames[i]
            );
            opportunities[nextOpportunityId].nextPreRequirementId++;
        }

        //adding post requirements
        for(uint i = 0; i < postRequirementTypes.length; i++) {
            opportunities[nextOpportunityId].postRequirements[opportunities[nextOpportunityId].nextPostRequirementId] = Requirement(
                opportunities[nextOpportunityId].nextPostRequirementId,
                postRequirementTypes[i],
                postRequirementValues[i],
                postRequirementNames[i]
            );
            opportunities[nextOpportunityId].nextPostRequirementId++;
        }

        emit OpportunityCreated(nextOpportunityId, opportunities[nextOpportunityId].name, opportunities[nextOpportunityId].description);
        nextOpportunityId++;        
    }

    function createApplication(uint opportunityId)
        public onlyBeneficiary() {

        //validating opportunity is open for applications
        require (opportunities[opportunityId].status == 2, 'opportunity not open for applications');

        applications[nextApplicationId].id = nextApplicationId;
        applications[nextApplicationId].opportunityId = opportunityId;
        applications[nextOpportunityId].beneficiaryId = getBeneficiaryIdByAddress(msg.sender);
        applications[nextApplicationId].nextPreRequirementId = 0;
        applications[nextApplicationId].nextPostRequirementId = 0;
        applications[nextApplicationId].nextPreAccomplishmentId = 0;
        applications[nextApplicationId].nextPostAccomplishmentId = 0;
        applications[nextApplicationId].status = 1;

        Accomplishment memory _accomplishment;
        _accomplishment.id = 0;
        _accomplishment.requirementId = 0;
        _accomplishment.accomplishDate = now;
        _accomplishment.accomplishCategory = 1;     //started
        _accomplishment.accomplishValue = "";
        applications[nextApplicationId].preAccomplishments.push(_accomplishment);

        //incrementing pre accomplishment id for application
        applications[nextApplicationId].nextPreAccomplishmentId++;

        emit ApplicationCreated(nextApplicationId, applications[nextApplicationId].opportunityId);
        nextApplicationId++;
    }

    /*function getOpportunities()
        public view returns(uint[] memory, uint[] memory, string[] memory, string[] memory, string[] memory, uint[] memory, uint[] memory, uint[] memory, uint[] memory, uint[] memory) {

        uint[] memory ids = new uint[](nextOpportunityId);
        uint[] memory organizationIds = new uint[](nextOpportunityId);
        string[] memory organizationNames = new string[](nextOpportunityId);
        string[] memory names = new string[](nextOpportunityId);
        string[] memory descriptions = new string[](nextOpportunityId);
        uint[] memory creationDates = new uint[](nextOpportunityId);
        uint[] memory preRequirementsDeadlines = new uint[](nextOpportunityId);
        uint[] memory postRequirementsDeadlines = new uint[](nextOpportunityId);
        uint[] memory lastUpdates = new uint[](nextOpportunityId);
        uint[] memory status = new uint[](nextOpportunityId);

        for (uint i = 0; i < nextOpportunityId; i++) {
            Opportunity memory _opportunity = opportunities[i];
            ids[i] = _opportunity.id;
            organizationIds[i] = _opportunity.organizationId;
            organizationNames[i] = organizations[_opportunity.organizationId].name;
            names[i] = _opportunity.name;
            descriptions[i] = _opportunity.description;
            creationDates[i] = _opportunity.creationDate;
            preRequirementsDeadlines[i] = _opportunity.preRequirementsDeadline;
            postRequirementsDeadlines[i] = _opportunity.postRequirementsDeadline;
            lastUpdates[i] = _opportunity.lastUpdate;
            status[i] = _opportunity.status;
        }
        return (ids, organizationIds, organizationNames, names, descriptions, creationDates, preRequirementsDeadlines, postRequirementsDeadlines, lastUpdates, status);
    }*/

    function getOpportunities()
        public view returns(uint[] memory, string[] memory, string[] memory, string[] memory, uint[] memory, uint[] memory, uint[] memory, uint[] memory) {

        uint[] memory ids = new uint[](nextOpportunityId);
        string[] memory organizationNames = new string[](nextOpportunityId);
        string[] memory names = new string[](nextOpportunityId);
        string[] memory descriptions = new string[](nextOpportunityId);
        uint[] memory preRequirementDeadlines = new uint[](nextOpportunityId);
        uint[] memory postRequirementsDeadlines = new uint[](nextOpportunityId);
        uint[] memory lastUpdates = new uint[](nextOpportunityId);
        uint[] memory status = new uint[](nextOpportunityId);


        for (uint i = 0; i < nextOpportunityId; i++) {
            Opportunity memory _opportunity = opportunities[i];
            ids[i] = _opportunity.id;
            organizationNames[i] = organizations[_opportunity.organizationId].name;
            names[i] = _opportunity.name;
            descriptions[i] = _opportunity.description;
            preRequirementDeadlines[i] = _opportunity.preRequirementsDeadline;
            postRequirementsDeadlines[i] = _opportunity.postRequirementsDeadline;
            status[i] = _opportunity.status;
        }
        return (ids, organizationNames, names, descriptions, preRequirementDeadlines, postRequirementsDeadlines, lastUpdates, status);
    }

    // function getOpportunityById(uint opportunityId)
    //     public view returns(Opportunity memory _opportunity) {

    //     Opportunity memory _opportunity = opportunities[opportunityId];

    //     return _opportunity;
    // }

    function getOpportunityById(uint opportunityId)
        public view returns(uint, string memory, string memory, uint, uint, uint, uint, uint) {

        Opportunity storage _opportunity = opportunities[opportunityId];

        return (_opportunity.organizationId, _opportunity.name, _opportunity.description, _opportunity.creationDate, _opportunity.preRequirementsDeadline, _opportunity.postRequirementsDeadline, _opportunity.lastUpdate, _opportunity.status);
    }

    // function getOpportunityById(uint opportunityId)
    //     public view returns(uint, string memory, string memory, uint, uint, uint, uint, uint, uint[] memory, uint[] memory, uint[] memory, string[] memory, uint[] memory, uint[] memory, uint[] memory, string[] memory) {

    //     Opportunity storage _opportunity = opportunities[opportunityId];

    //     uint[] memory preRequirementIds = new uint[](_opportunity.nextPreRequirementId);
    //     uint[] memory preRequirementTypes = new uint[](_opportunity.nextPreRequirementId);
    //     uint[] memory preRequirementValues = new uint[](_opportunity.nextPreRequirementId);
    //     string[] memory preRequirementNames = new string[](_opportunity.nextPreRequirementId);

    //     uint[] memory posRequirementIds = new uint[](_opportunity.nextPostRequirementId);
    //     uint[] memory posRequirementTypes = new uint[](_opportunity.nextPostRequirementId);
    //     uint[] memory posRequirementValues = new uint[](_opportunity.nextPostRequirementId);
    //     string[] memory posRequirementNames = new string[](_opportunity.nextPostRequirementId);

    //     for (uint i = 0; i < _opportunity.nextPreRequirementId; i++) {
    //         Requirement memory _requirement = _opportunity.preRequirements[i];
    //         preRequirementIds[i] = _requirement.id;
    //         preRequirementTypes[i] = _requirement.requirementType;
    //         preRequirementValues[i] = _requirement.transferValue;
    //         preRequirementNames[i] = _requirement.name;
    //     }

    //     for (uint i = 0; i < _opportunity.nextPostRequirementId; i++) {    
    //         Requirement memory _requirement = _opportunity.postRequirements[i];        
    //         posRequirementIds[i] = _requirement.id;
    //         posRequirementTypes[i] = _requirement.requirementType;
    //         posRequirementValues[i] = _requirement.transferValue;
    //         posRequirementNames[i] = _requirement.name;
    //     }

    //     return (_opportunity.organizationId, _opportunity.name, _opportunity.description, _opportunity.creationDate, _opportunity.preRequirementsDeadline, _opportunity.postRequirementsDeadline, _opportunity.lastUpdate, _opportunity.status, preRequirementIds, preRequirementTypes, preRequirementValues, preRequirementNames, posRequirementIds, posRequirementTypes, posRequirementValues, posRequirementNames);
    // }

    function getPreRequirementsByOpportunityId(uint opportunityId) 
        public view returns(uint[] memory, uint[] memory, uint[] memory, string[] memory) {

        Opportunity storage _opportunity = opportunities[opportunityId];
        uint[] memory preRequirementIds = new uint[](_opportunity.nextPreRequirementId);
        uint[] memory preRequirementTypes = new uint[](_opportunity.nextPreRequirementId);
        uint[] memory preRequirementValues = new uint[](_opportunity.nextPreRequirementId);
        string[] memory preRequirementNames = new string[](_opportunity.nextPreRequirementId);

        for (uint i = 0; i < _opportunity.nextPreRequirementId; i++) {
            Requirement memory _requirement = _opportunity.preRequirements[i];
            preRequirementIds[i] = _requirement.id;
            preRequirementTypes[i] = _requirement.requirementType;
            preRequirementValues[i] = _requirement.transferValue;
            preRequirementNames[i] = _requirement.name;
        }
        return (preRequirementIds, preRequirementTypes, preRequirementValues, preRequirementNames);
    }

    function getPostRequirementsByOpportunityId(uint opportunityId) 
        public view returns(uint[] memory, uint[] memory, uint[] memory, string[] memory) {

        Opportunity storage _opportunity = opportunities[opportunityId];
        uint[] memory postRequirementIds = new uint[](_opportunity.nextPostRequirementId);
        uint[] memory postRequirementTypes = new uint[](_opportunity.nextPostRequirementId);
        uint[] memory postRequirementValues = new uint[](_opportunity.nextPostRequirementId);
        string[] memory postRequirementNames = new string[](_opportunity.nextPostRequirementId);

        for (uint i = 0; i < _opportunity.nextPostRequirementId; i++) {    
            Requirement memory _requirement = _opportunity.postRequirements[i];        
            postRequirementIds[i] = _requirement.id;
            postRequirementTypes[i] = _requirement.requirementType;
            postRequirementValues[i] = _requirement.transferValue;
            postRequirementNames[i] = _requirement.name;
        }

        return (postRequirementIds, postRequirementTypes, postRequirementValues, postRequirementNames);
    }

    function getPreAccomplishment(uint applicationId, uint preAccomplishmentId) 
        public view returns(Accomplishment memory _accomplishment) {
        Accomplishment memory accomplishment = applications[applicationId].preAccomplishments[preAccomplishmentId];
        return accomplishment;
    }

    function getPostAccomplishment(uint applicationId, uint postAccomplishmentId) 
        public view returns(Accomplishment memory _accomplishment) {
        Accomplishment memory accomplishment = applications[applicationId].postAccomplishments[postAccomplishmentId];
        return accomplishment;
    }

    function createPreAccomplishment(
        uint applicationId,
        string memory accomplishmentValue
    ) public onlyBeneficiary() {    
        
        require(applications[applicationId].status == 1, "application has not started to receive preAccomplishments");
        //adding a new accomplishment in the current application
        applications[applicationId].preAccomplishments.push(
            Accomplishment(
                applications[applicationId].nextPreAccomplishmentId,
                applications[applicationId].nextPreRequirementId,
                now,
                2,                          //finished
                accomplishmentValue
            )
        );

        //validating if the opportunity related to this opportunity has more steps        
        if (opportunities[applications[applicationId].opportunityId].nextPreRequirementId > (applications[applicationId].nextPreRequirementId + 1)) {
            
            //incrementing pre accomplishment id for application
            applications[applicationId].nextPreAccomplishmentId++;

            //incrementing pre requirement id for application
            applications[applicationId].nextPreRequirementId++;

            //start next accomplishment
            applications[applicationId].preAccomplishments.push(
                Accomplishment(
                    applications[applicationId].nextPreAccomplishmentId,
                    applications[applicationId].nextPreRequirementId,
                    now,
                    1,                        //started
                    accomplishmentValue
                )
            );

            //incrementing pre accomplishment id for application
            applications[applicationId].nextPreAccomplishmentId++;
        } else {
            applications[applicationId].status = 2;
        }
    }

    function createPostAccomplishment(
        uint applicationId,
        string memory accomplishmentValue
    ) public onlyBeneficiary() {    
        
        require(applications[applicationId].status == 5, "application has not started to receive postAccomplishments");

        //adding a new accomplishment in the current application
        applications[applicationId].postAccomplishments.push(
            Accomplishment(
                applications[applicationId].nextPostAccomplishmentId,
                applications[applicationId].nextPostRequirementId,
                now,
                2,                          //finished
                accomplishmentValue
            )
        );

        //validating if the opportunity related to this opportunity has more steps        
        if (opportunities[applications[applicationId].opportunityId].nextPostRequirementId > (applications[applicationId].nextPostRequirementId + 1)) {
            
            //incrementing post accomplishment id for application
            applications[applicationId].nextPostAccomplishmentId++;

            //incrementing post requirement id for application
            applications[applicationId].nextPostRequirementId++;

            //start next accomplishment
            applications[applicationId].postAccomplishments.push(
                Accomplishment(
                    applications[applicationId].nextPostAccomplishmentId,
                    applications[applicationId].nextPostRequirementId,
                    now,
                    1,                        //started
                    accomplishmentValue
                )
            );

            //incrementing post accomplishment id for application
            applications[applicationId].nextPostAccomplishmentId++;
        } else {
            applications[applicationId].status = 6;
        }
    }

    function updateOpportunityStatus(
        uint opportunityId,
        uint status
    ) public onlyOrganization() {

        require(status > 0 && status <= 7, "opportunity status not valid");

        if(status == 2) {
            require(opportunities[opportunityId].status == 1, "opportunity must be in draft to be open");
        }

        if(status == 3) {
            require(opportunities[opportunityId].status == 2, "opportunity must be open for review");
        }

        if(status == 4) {
            require(opportunities[opportunityId].status == 3, "opportunity must be in review for applications selected");
        }

        if(status == 5) {
            require(opportunities[opportunityId].status == 4, "opportunity must be in applications selected for opportunity initiated");
        }

        if(status == 6) {
            require(opportunities[opportunityId].status == 5, "opportunity must be in initiated for finalize");
            for (uint i = 0; i < nextApplicationId; i++) {
                //if application is approved then once the opportunity change to finalized, all change to accept postAccomplishments.
                if (applications[i].opportunityId == opportunityId) {
                    if (applications[i].status == 3) {
                        applications[i].status = 5;

                        Accomplishment memory _accomplishment;
                        _accomplishment.id = 0;
                        _accomplishment.requirementId = 0;
                        _accomplishment.accomplishDate = now;
                        _accomplishment.accomplishCategory = 1;     //started
                        _accomplishment.accomplishValue = "";
                        applications[i].postAccomplishments.push(_accomplishment);

                        //incrementing post accomplishment id for application
                        applications[i].nextPostAccomplishmentId++;
                    }
                }
            }
        }

        if(status == 7) {
            require(opportunities[opportunityId].status == 6, "opportunity must be finalized for close postRequirement reception");
        }

        opportunities[opportunityId].status = status;

        //1. draft
        //2. open to applications
        //3. reviewing applications
        //4. applications selected
        //5. opportunity initiated
        //6. opportunity finalized
        //7. postRequirements concluded
    }

    function updateApplicationStatus(
        uint applicationId,
        uint status
    ) public onlyOrganizationOrBeneficiary() {

        uint _currentStatus = applications[applicationId].status;

        require(_currentStatus > 0 && _currentStatus <= 7, "application status not valid");
        
        if(status == 2) {
            require(_currentStatus == 1, "application must be preAccomplishments started to be finalize preAccomplishments");
            require(isBeneficiary(msg.sender), "application status change must be executed by beneficiary");
        }

        if(status == 3 || status == 4) {
            require(_currentStatus == 2, "application must be preAccomplishments finalized to be either approved or rejected");
            require(isOrganization(msg.sender), "application status change must be executed by organization");
        }

        if(status == 5) {
            require(_currentStatus == 3 || _currentStatus == 4, "application must be either approved or rejected to start receiving postAccomplishments");
            require(isOrganization(msg.sender), "application status change must be executed by organization");
        }

        if(status == 6) {
            require(_currentStatus == 5, "application must have started receiving postAccomplishments to finalize its reception");
            require(isBeneficiary(msg.sender), "application status change must be executed by beneficiary");
        }

        //application is completed when all pre and post accomplishments where completed succesfully
        if(status == 7 || status == 8) {
            require(_currentStatus == 6, "application postAccomplishments must be finalized to finalize it");
            require(isOrganization(msg.sender), "application status change must be executed by organization");
        }

        applications[applicationId].status = status;

        //1. preRequirements started => beneficiary
        //2. preRequirements finalized => beneficiary
        //3. application approved => organization
        //4. application rejected => organization
        //5. postRequirement started => organization
        //6. postRequirement finalized => beneficiary
        //7. application complete => organization
        //8. application incomplete => organization
    }

    //validations

    function getOrganizationIdByAddress(address account) public view returns (uint) {
        uint _organizationId = 0;

        for (uint i = 0; i < nextOrganizationId; i++) {
            if (organizations[i].account == account && organizations[i].status == 3) {
                _organizationId = organizations[i].id;
            }
        }

        return _organizationId;
    }

    function getBeneficiaryIdByAddress(address account) public view returns (uint) {
        uint _beneficiaryId = 0;

        for (uint i = 0; i < nextBeneficiaryId; i++) {
            if (beneficiaries[i].account == account && beneficiaries[i].status == 3) {
                _beneficiaryId = beneficiaries[i].id;
            }
        }

        return _beneficiaryId;
    }

    function getBeneficiaryStatusByAddress(address account) public view returns (uint) {
        uint _beneficiaryStatus = 0;

        for (uint i = 0; i < nextBeneficiaryId; i++) {
            if (beneficiaries[i].account == account && beneficiaries[i].status == 3) {
                _beneficiaryStatus = beneficiaries[i].id;
            }
        }

        return _beneficiaryStatus;
    }

    function isOrganization(address account) public  view returns (bool) {

        bool _isOrganization = false;

        for (uint i = 0; i < nextOrganizationId; i++) {
            if (organizations[i].account == account && organizations[i].status == 3) {
                _isOrganization = true;
            }
        }

        return _isOrganization;
    }

    function isBeneficiary(address account) public  view returns (bool) {

        bool _isBeneficiary = false;

        for (uint i = 0; i < nextBeneficiaryId; i++) {
            if (beneficiaries[i].account == account && beneficiaries[i].status == 3) {
                _isBeneficiary = true;
            }
        }
        return _isBeneficiary;
    }

    //modifiers

    modifier onlyAdmin() {
        require(msg.sender == admin, 'only admin');
        _;
    }

    modifier notAdmin() {
        require(msg.sender != admin, 'not admin');
        _;
    }

    modifier onlyOrganization() {
        bool _isOrganization = isOrganization(msg.sender);
        require(_isOrganization, 'only organization');
        _;
    }

    modifier onlyOrganizationOrBeneficiary() {
        bool _isOrganization = isOrganization(msg.sender);
        bool _isBeneficiary = isBeneficiary(msg.sender);
        require(_isOrganization || _isBeneficiary, 'only active organization');
        _;
    }

    modifier notOrganization() {
        bool _isOrganization = isOrganization(msg.sender);
        require(!_isOrganization, 'not organization');
        _;
    }

    modifier onlyBeneficiary() {
        bool _isBeneficiary = isBeneficiary(msg.sender);
        require(_isBeneficiary, 'only active beneficiary');
        _;
    }
}