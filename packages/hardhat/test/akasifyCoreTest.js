const { ethers } = require("hardhat");
const { use, expect, assert } = require('chai');
const { solidity } = require('ethereum-waffle');

use(solidity);

describe('Digital Bonds - Smart Contract Tests', function () {
  
  let [admin, organization, beneficiary, beneficiary2] = ['', '', '', ''];

  describe('Akasify', function () {
    
    it('Should deploy akasify core contract', async () => {
      [admin, organization, beneficiary, beneficiary2] = await ethers.getSigners();
      const adminAddress = await admin.getAddress();
      const AkasifyCore = await ethers.getContractFactory("AkasifyCoreContract");
      akasifyCore = await AkasifyCore.deploy(adminAddress);
      await akasifyCore.deployed();
    });

    it('Should register an organization by admin', async () => {
      const organizationAddress = await organization.getAddress();
      await akasifyCore.registerOrganizationByAdmin("Digital Bonds", organizationAddress, 3);
      const organizationValues = await akasifyCore.getOrganizationByAddress(organizationAddress);
      assert(organizationValues[2] === organizationAddress && organizationValues[4].toNumber() === 3, 'verify status');
    });

    // it('Should register a beneficiary by admin', async () => {   
    //   const beneficiaryAddress = await beneficiary.getAddress();         
    //   await akasifyCore.registerBeneficiaryByAdmin(beneficiaryAddress, 3);
    //   const beneficiaryValues = await akasifyCore.getBeneficiaryByAddress(beneficiaryAddress);
    //   assert(beneficiaryValues[1] === beneficiaryAddress && beneficiaryValues[3].toNumber() === 3, 'verify status');
    // });

    it('Should register a beneficiary', async () => {      
      await akasifyCore.connect(beneficiary).registerBeneficiary();
      const beneficiaryAddress = await beneficiary.getAddress();
      const role = await akasifyCore.getRole(beneficiaryAddress);
      assert(role === 'beneficiary', 'verify roles');
    });

    it('Should register an opportunity', async () => {
      await akasifyCore.connect(organization).createOpportunity(
        "opportunity name",
        "opportunity description",
        0,
        0,
        [1, 1],
        [0, 0],
        ["First pre requirement", "Second pre requirement"],
        [1, 1, 1],
        [0, 0, 0],
        ["First post requirement", "Second post requirement", "Third post requirement"]
      );
      const opportunity = await akasifyCore.opportunities(0);
      assert(opportunity.name == "opportunity name", 'opportunity not created');      
    });

    it('Should not register an application if opportunity status is draft', async () => {
      try {
        await akasifyCore.connect(beneficiary).createApplication(0);
      } catch (e) {
        assert(e.message.includes('opportunity not open for applications'));
        return;
      }
      assert(false);      
    });

    it('Should update application status to receiving applications', async () => {
      await akasifyCore.connect(organization).updateOpportunityStatus(0, 2);
      const opportunity = await akasifyCore.opportunities(0);
      assert(opportunity.status == 2, 'opportunity not receiving applications');
    });

    it('Should register an application', async () => {
      const beneficiaryAddress = await beneficiary.getAddress();
      const beneficiaryStatus = await akasifyCore.connect(beneficiary).isBeneficiary(beneficiaryAddress);
      console.log("is beneficiary with status 3, ", beneficiaryStatus);

      await akasifyCore.connect(beneficiary).createApplication(0);
      const application = await akasifyCore.applications(0);
      const preAccomplishment = await akasifyCore.getPreAccomplishment(0, 0);
      assert(application.status == 1, 'application not created');
      assert(preAccomplishment.accomplishCategory == 1, 'pre accomplishment not created');
    });

    /* it('Should register a pre accomplishment', async () => {
      await akasifyCore.connect(beneficiary).createPreAccomplishment(0, "");
      const preAccomplishment = await akasifyCore.getPreAccomplishment(0, 1);
      const autoPreAccomplishment = await akasifyCore.getPreAccomplishment(0, 2);
      assert(preAccomplishment.requirementId == 0 && preAccomplishment.accomplishCategory == 2, 'pre accomplishment not created');
      assert(autoPreAccomplishment.requirementId == 1 && autoPreAccomplishment.accomplishCategory == 1, 'pre accomplishment not created');
    });

    it('Should finish application preAccomplishments', async () => {
      await akasifyCore.connect(beneficiary).createPreAccomplishment(0, "");
      const preAccomplishment = await akasifyCore.getPreAccomplishment(0, 3);
      const application = await akasifyCore.applications(0);
      assert(preAccomplishment.requirementId == 1 && preAccomplishment.accomplishCategory == 2, 'pre accomplishment not created');
      assert(application.status == 2, 'preAccomplishments not finalized');
    });

    it('Should not create additional accomplishment if application was finished', async () => {
      try {
        await akasifyCore.getPreAccomplishment(0, 4);
      } catch (e) {
        assert(e.message.includes('invalid opcode'));
        return;
      }
      assert(false);
    });

    it('Should update opportunity status to reviewing applications', async () => {
      await akasifyCore.connect(organization).updateOpportunityStatus(0, 3);
      const opportunity = await akasifyCore.opportunities(0);
      assert(opportunity.status == 3, 'opportunity not reviewing applications');
    });

    it('Should update application status to accepted', async () => {
      await akasifyCore.connect(organization).updateApplicationStatus(0, 3);
      const application = await akasifyCore.applications(0);
      assert(application.status == 3, 'application not accepted');
    });

    it('Should update opportunity status to applications accepted', async () => {
      await akasifyCore.connect(organization).updateOpportunityStatus(0, 4);
      const opportunity = await akasifyCore.opportunities(0);
      assert(opportunity.status == 4, 'opportunity not applications selected');
    });

    //this status will change when the opportunity start to being provided by the organization
    it('Should update opportunity status to initiated', async () => {
      await akasifyCore.connect(organization).updateOpportunityStatus(0, 5);
      const opportunity = await akasifyCore.opportunities(0);
      assert(opportunity.status == 5, 'opportunity not initiated');
    });

    it('Should update opportunity status to finalized', async () => {
      await akasifyCore.connect(organization).updateOpportunityStatus(0, 6);
      const opportunity = await akasifyCore.opportunities(0);
      assert(opportunity.status == 6, 'opportunity finalized');
    });

    it('Should automatically update application status to receive postAccomplishments', async () => {
      const application = await akasifyCore.applications(0);
      assert(application.status == 5, 'application postRequirements not started');
    });

    it('Should register a post accomplishment', async () => {      
      await akasifyCore.connect(beneficiary).createPostAccomplishment(0, "");
      const postAccomplishment = await akasifyCore.getPostAccomplishment(0, 1);
      assert(postAccomplishment.requirementId == 0 && postAccomplishment.accomplishCategory == 2, 'post accomplishment not created');
    });

    it('Should register another post accomplishment', async () => {      
      await akasifyCore.connect(beneficiary).createPostAccomplishment(0, "");
      const postAccomplishment = await akasifyCore.getPostAccomplishment(0, 3);      
      assert(postAccomplishment.requirementId == 1 && postAccomplishment.accomplishCategory == 2, 'post accomplishment not created');
    });

    it('Should finish application postAccomplishments', async () => {      
      await akasifyCore.connect(beneficiary).createPostAccomplishment(0, "");
      const postAccomplishment = await akasifyCore.getPostAccomplishment(0, 5);
      const application = await akasifyCore.applications(0);
      assert(postAccomplishment.requirementId == 2 && postAccomplishment.accomplishCategory == 2, 'post accomplishment not created');
      assert(application.status == 6, 'preAccomplishments not finalized');
    });

    it('Should not create additional postAccomplishment if application postAccomplishments was finished', async () => {
      try {
        await akasifyCore.getPreAccomplishment(0, 6);
      } catch (e) {
        assert(e.message.includes('invalid opcode'));
        return;
      }
      assert(false);
    }); */

  });
});
