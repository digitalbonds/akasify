pragma solidity >=0.6.6;
pragma experimental ABIEncoderV2;
// SPDX-License-Identifier: MIT

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
        string oasisAddress;
        uint registerDate;
        uint status;
    }

    struct Opportunity {
        uint id;
        uint organizationId;
        string name;
        string description;        
        uint preRequirementsDeadline;
        uint postRequirementsDeadline;
        uint creationDate;
        uint lastUpdate;
        uint applicationCount;
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
        Requirement[] preRequirements;
        Requirement[] postRequirements;
    }

    struct Requirement {
        uint id;
        uint opportunityId;
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
        uint creationDate;
        uint lastUpdate;
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
    event RegisterBeneficiary(address account);
    event RegisterOpportunity(uint id, string name, string description);
    event UpdateOpportunityStatus(uint id, uint status);
    event RegisterApplication(uint id, uint opportunityId);
    event UpdateApplicationStatus(uint id, uint status);
    event RegisterApplicationPreAccomplishment(uint id, uint requirementId, uint applicationId, uint opportunityId);
    event RegisterApplicationPostAccomplishment(uint id, uint requirementId, uint applicationId, uint opportunityId);

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
            block.timestamp,
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

    function registerBeneficiary(string memory _oasisAddress) public notAdmin() notOrganization() {
        beneficiaries[nextBeneficiaryId] = Beneficiary(
            nextBeneficiaryId,
            msg.sender,
            _oasisAddress,
            block.timestamp,
            3
        );
        nextBeneficiaryId++;
        emit RegisterBeneficiary(msg.sender);
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
        public view returns(uint, address, string memory, uint, uint) {
        Beneficiary memory _beneficiary = beneficiaries[_id];
        return (_beneficiary.id, _beneficiary.account, _beneficiary.oasisAddress, _beneficiary.registerDate, _beneficiary.status); 
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
        opportunities[nextOpportunityId].creationDate = block.timestamp;
        opportunities[nextOpportunityId].preRequirementsDeadline = preRequirementsDeadline;
        opportunities[nextOpportunityId].postRequirementsDeadline = postRequirementsDeadline;
        opportunities[nextOpportunityId].lastUpdate = block.timestamp;
        opportunities[nextOpportunityId].status = 1;

        //adding pre requirements
        for(uint i = 0; i < preRequirementTypes.length; i++) {
            opportunities[nextOpportunityId].preRequirements.push(
                Requirement(
                    opportunities[nextOpportunityId].nextPreRequirementId,
                    nextOpportunityId,
                    preRequirementTypes[i],
                    preRequirementValues[i],
                    preRequirementNames[i]
                )
            );
            opportunities[nextOpportunityId].nextPreRequirementId++;
        }

        //adding post requirements
        for(uint i = 0; i < postRequirementTypes.length; i++) {
            opportunities[nextOpportunityId].postRequirements.push(
                 Requirement(
                    opportunities[nextOpportunityId].nextPostRequirementId,
                    nextOpportunityId,
                    postRequirementTypes[i],
                    postRequirementValues[i],
                    postRequirementNames[i]
                )
            );
            opportunities[nextOpportunityId].nextPostRequirementId++;
        }

        emit RegisterOpportunity(nextOpportunityId, opportunities[nextOpportunityId].name, opportunities[nextOpportunityId].description);
        nextOpportunityId++;        
    }

    function createApplication(uint opportunityId)
        //public onlyBeneficiary() {
        public {

        //validating opportunity is open for applications
        require (opportunities[opportunityId].status == 2, 'opportunity not open for applications');

        //validating there's no other application for this opportunity for this beneficiary

        applications[nextApplicationId].id = nextApplicationId;
        applications[nextApplicationId].opportunityId = opportunityId;
        applications[nextOpportunityId].beneficiaryId = getBeneficiaryIdByAddress(msg.sender);
        applications[nextApplicationId].nextPreRequirementId = 0;
        applications[nextApplicationId].nextPostRequirementId = 0;
        applications[nextApplicationId].nextPreAccomplishmentId = 0;
        applications[nextApplicationId].nextPostAccomplishmentId = 0;
        applications[nextApplicationId].creationDate = block.timestamp;
        applications[nextApplicationId].lastUpdate = block.timestamp;
        applications[nextApplicationId].status = 1;

        //Increment application count in the opportunity
        opportunities[opportunityId].applicationCount++;

        Accomplishment memory _accomplishment;
        _accomplishment.id = 0;
        _accomplishment.requirementId = 0;
        _accomplishment.accomplishDate = block.timestamp;
        _accomplishment.accomplishCategory = 1;     //started
        _accomplishment.accomplishValue = "";
        applications[nextApplicationId].preAccomplishments.push(_accomplishment);

        //incrementing pre accomplishment id for application
        applications[nextApplicationId].nextPreAccomplishmentId++;

        emit RegisterApplication(nextApplicationId, applications[nextApplicationId].opportunityId);
        nextApplicationId++;
    }

    function createPreRequirement(
        uint opportunityId,
        uint requirementType,
        uint transferValue,
        string memory name
    ) public onlyOrganization() {    
                
        require(opportunities[opportunityId].status == 1, "opportunity is not in draft mode");

        //adding a new pre requirement in the opportunity
        opportunities[opportunityId].preRequirements.push(
            Requirement(
                opportunities[opportunityId].nextPreRequirementId,
                opportunityId,
                requirementType,
                transferValue,
                name
            )
        );

        opportunities[opportunityId].nextPreRequirementId++;
    }

    function createPostRequirement(
        uint opportunityId,
        uint requirementType,
        uint transferValue,
        string memory name
    ) public onlyOrganization() {    
                
        require(opportunities[opportunityId].status == 1, "opportunity is not in draft mode");

        //adding a new post requirement in the opportunity
        opportunities[opportunityId].postRequirements.push(
            Requirement(
                opportunities[opportunityId].nextPostRequirementId,
                opportunityId,
                requirementType,
                transferValue,
                name
            )
        );

        opportunities[opportunityId].nextPostRequirementId++;

    }

    function getOpportunities()
        public view returns(uint[] memory, string[] memory, string[] memory, string[] memory, uint[] memory, uint[] memory, uint[] memory) {

        uint[] memory ids = new uint[](nextOpportunityId);
        string[] memory organizationNames = new string[](nextOpportunityId);
        string[] memory names = new string[](nextOpportunityId);
        string[] memory descriptions = new string[](nextOpportunityId);
        uint[] memory preRequirementDeadlines = new uint[](nextOpportunityId);
        uint[] memory postRequirementsDeadlines = new uint[](nextOpportunityId);
        //uint[] memory creationDates = new uint[](nextOpportunityId);
        //uint[] memory lastUpdates = new uint[](nextOpportunityId);
        uint[] memory status = new uint[](nextOpportunityId);


        for (uint i = 0; i < nextOpportunityId; i++) {
            Opportunity storage _opportunity = opportunities[i];
            ids[i] = _opportunity.id;
            organizationNames[i] = organizations[_opportunity.organizationId].name;
            names[i] = _opportunity.name;
            descriptions[i] = _opportunity.description;
            preRequirementDeadlines[i] = _opportunity.preRequirementsDeadline;
            postRequirementsDeadlines[i] = _opportunity.postRequirementsDeadline;
            //creationDates[i] = _opportunity.creationDate;
            //lastUpdates[i] = _opportunity.lastUpdate;
            status[i] = _opportunity.status;
        }
        //return (ids, organizationNames, names, descriptions, preRequirementDeadlines, postRequirementsDeadlines, creationDates, lastUpdates, status);
        return (ids, organizationNames, names, descriptions, preRequirementDeadlines, postRequirementsDeadlines, status);
    }

    function getOpportunityById(uint opportunityId)
        public view returns(uint, string memory, string memory, uint, uint, uint, uint, uint) {

        Opportunity storage _opportunity = opportunities[opportunityId];

        return (_opportunity.organizationId, _opportunity.name, _opportunity.description, _opportunity.preRequirementsDeadline, _opportunity.postRequirementsDeadline, _opportunity.creationDate, _opportunity.lastUpdate, _opportunity.status);
    }

    function getApplication(uint opportunityId, address beneficiaryAddress) 
        public view returns(uint, uint, uint, uint, uint, uint) {

        uint _beneficiaryId = getBeneficiaryIdByAddress(beneficiaryAddress);
        Application memory _application;

        for (uint i = 0; i < nextApplicationId; i++) {
            if (applications[i].opportunityId == opportunityId && applications[i].beneficiaryId == _beneficiaryId) {
                _application = applications[i];
            }
        }
        
        return (_application.id, _application.opportunityId, _application.beneficiaryId, _application.creationDate, _application.lastUpdate, _application.status);
    }

    function getApplicationsByOpportunityId(uint opportunityId) 
        public view returns(uint[] memory, address[] memory, string[] memory, uint[] memory) {

        Opportunity storage _opportunity = opportunities[opportunityId];
        uint[] memory appIds = new uint[](_opportunity.applicationCount);
        address[] memory appBeneficiaryAddress = new address[](_opportunity.applicationCount);
        string[] memory appBeneficiaryOasisAddress = new string[](_opportunity.applicationCount);
        uint[] memory appStatus = new uint[](_opportunity.applicationCount);

        uint appCount = 0;
        for (uint i = 0; i < nextApplicationId; i++) {
            Application memory _application = applications[i];    
            Beneficiary memory _beneficiary = beneficiaries[_application.beneficiaryId];        
            if (_application.opportunityId == opportunityId) {
                appIds[appCount] = _application.id;
                appBeneficiaryAddress[appCount] = _beneficiary.account;
                appBeneficiaryOasisAddress[appCount] = _beneficiary.oasisAddress;                
                appStatus[appCount] = _application.status;
                appCount++;
            }
        }
        
        return (appIds, appBeneficiaryAddress, appBeneficiaryOasisAddress, appStatus);

    }

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

    function getPreAccomplishmentsByApplicationId(uint applicationId)
        public view returns(uint[] memory, uint[] memory, uint[] memory, uint[] memory, string[] memory) {

        Application storage _application = applications[applicationId];
        uint[] memory preAccomplishmentIds = new uint[](_application.preAccomplishments.length);
        uint[] memory preRequirementIds = new uint[](_application.preAccomplishments.length);
        uint[] memory preAccomplishDates = new uint[](_application.preAccomplishments.length);
        uint[] memory preAccomplishCategories = new uint[](_application.preAccomplishments.length);
        string[] memory preAccomplishValues = new string[](_application.preAccomplishments.length);
        
        for (uint i = 0; i < _application.preAccomplishments.length; i++) {
            Accomplishment memory _accomplishment = _application.preAccomplishments[i];
            preAccomplishmentIds[i] = _accomplishment.id;
            preRequirementIds[i] = _accomplishment.requirementId;
            preAccomplishDates[i] = _accomplishment.accomplishDate;
            preAccomplishCategories[i] = _accomplishment.accomplishCategory;
            preAccomplishValues[i] = _accomplishment.accomplishValue;
        }
        if (_application.preAccomplishments.length > _application.nextPreAccomplishmentId) {
            Accomplishment memory _accomplishment = _application.preAccomplishments[_application.nextPreAccomplishmentId];
            preAccomplishmentIds[_application.nextPreAccomplishmentId] = _accomplishment.id;
            preRequirementIds[_application.nextPreAccomplishmentId] = _accomplishment.requirementId;
            preAccomplishDates[_application.nextPreAccomplishmentId] = _accomplishment.accomplishDate;
            preAccomplishCategories[_application.nextPreAccomplishmentId] = _accomplishment.accomplishCategory;
            preAccomplishValues[_application.nextPreAccomplishmentId] = _accomplishment.accomplishValue;
        }
        return (preAccomplishmentIds, preRequirementIds, preAccomplishDates, preAccomplishCategories, preAccomplishValues);
    }

    function getPreAccomplishment(uint applicationId, uint preAccomplishmentId) 
        public view returns(Accomplishment memory _accomplishment) {
        Accomplishment memory accomplishment = applications[applicationId].preAccomplishments[preAccomplishmentId];
        return accomplishment;
    }

    // function getPostAccomplishments(uint applicationId)
    //     public view returns(uint[] memory, uint[] memory, uint[] memory, uint[] memory, string[] memory) {

    //     Application storage _application = applications[applicationId];
    //     uint[] memory postAccomplishmentIds = new uint[](_application.nextPostRequirementId);
    //     uint[] memory postRequirementIds = new uint[](_application.nextPostRequirementId);
    //     uint[] memory postAccomplishDates = new uint[](_application.nextPostRequirementId);
    //     uint[] memory postAccomplishCategories = new uint[](_application.nextPostRequirementId);
    //     string[] memory postAccomplishValues = new string[](_application.nextPostRequirementId);
        

    //     for (uint i = 0; i < _application.nextPostAccomplishmentId; i++) {
    //         Accomplishment memory _accomplishment = _application.postAccomplishments[i];
    //         postAccomplishmentIds[i] = _accomplishment.id;
    //         postRequirementIds[i] = _accomplishment.requirementId;
    //         postAccomplishDates[i] = _accomplishment.accomplishDate;
    //         postAccomplishCategories[i] = _accomplishment.accomplishCategory;
    //         postAccomplishValues[i] = _accomplishment.accomplishValue;
    //     }
    //     return (postAccomplishmentIds, postRequirementIds, postAccomplishDates, postAccomplishCategories, postAccomplishValues);
    // }

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
                block.timestamp,
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
                    block.timestamp,
                    1,                        //started
                    ""
                )
            );

            RegisterApplicationPreAccomplishment(applications[applicationId].nextPreAccomplishmentId, applications[applicationId].nextPreRequirementId, applicationId, applications[applicationId].opportunityId);
            //incrementing pre accomplishment id for application
            applications[applicationId].nextPreAccomplishmentId++;            
        } else {
            applications[applicationId].status = 2;
            RegisterApplicationPreAccomplishment(applications[applicationId].nextPreAccomplishmentId, applications[applicationId].nextPreRequirementId, applicationId, applications[applicationId].opportunityId);
        }

        applications[applicationId].lastUpdate = block.timestamp;      
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
                block.timestamp,
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
                    block.timestamp,
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
                        _accomplishment.accomplishDate = block.timestamp;
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

        opportunities[opportunityId].lastUpdate = block.timestamp;
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
            if (beneficiaries[i].account == account) {
                _beneficiaryId = beneficiaries[i].id;
            }
        }

        return _beneficiaryId;
    }

    function getBeneficiaryStatusByAddress(address account) public view returns (uint) {
        uint _beneficiaryStatus = 0;

        for (uint i = 0; i < nextBeneficiaryId; i++) {
            if (beneficiaries[i].account == account && beneficiaries[i].status == 3) {
                _beneficiaryStatus = beneficiaries[i].status;
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
            if (beneficiaries[i].account == account) {
                _isBeneficiary = true;
            }
        }
        return _isBeneficiary;
    }

    function isActiveBeneficiary(address account) public  view returns (bool) {

        bool _isActiveBeneficiary = false;

        for (uint i = 0; i < nextBeneficiaryId; i++) {
            if (beneficiaries[i].account == account && beneficiaries[i].status == 3) {
                _isActiveBeneficiary = true;
            }
        }
        return _isActiveBeneficiary;
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
        require(_isBeneficiary, 'only beneficiary');
        _;
    }

    modifier onlyActiveBeneficiary() {
        bool _isBeneficiary = isActiveBeneficiary(msg.sender);
        require(_isBeneficiary, 'only active beneficiary');
        _;
    }
}