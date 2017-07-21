// Generate data if db is empty

const mongoose = require('mongoose');
const Model = require('../models/company');

async function bootstrap() {
    const anyCampaing = await Model.findOne({});
    if (!anyCampaing) {
        await createFakeData();
    }
    process.exit(0);
}

async function createFakeData() {
    console.log('Generating companies');
    const faker = require('faker');
    faker.seed(77077);

    for (let i = 0; i < 6; i++) {
        await createCompany({
            maxChilds: 9,
            parentId: null,
            nestedLevel: 5});
    }

    async function createCompany({maxChilds, parentId, nestedLevel}) {
        for (let i = 0;
             i < Math.max(faker.random.number({min: 0, max: maxChilds}),
                          faker.random.number({min: 0, max: maxChilds}));
             i++) {
            const name = faker.company.companyName();
            const earnings = faker.random.number({max: 999999});
            // create company and allow it fail
            const company = await Model.create({
                name, earnings, parentId: parentId
            }).catch((err) => {console.log('Fail to create company, but its ok', err)});
            console.log(' '.repeat((6 - nestedLevel) * 2), 'company', JSON.stringify(company));
            if (company && nestedLevel > 1) {
                await createCompany({
                    maxChilds: faker.random.number({min: 0, max: maxChilds}),
                    parentId: company._id,
                    nestedLevel: nestedLevel - 1});
            }
        }
    }
}

bootstrap();
