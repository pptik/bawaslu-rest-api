
exports.getVillageDetail=function(VillageID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let villageColl = database.collection('villages');
            let villageDetail = await villageColl.findOne({ village_code: VillageID });
            resolve(villageDetail);
        } catch (err) {
            reject(err)
        }
    })
};
exports.getDistrictDetail=function(DistrictID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let districtColl = database.collection('districts');
            let districtDetail = await districtColl.findOne({ district_code: DistrictID });
            resolve(districtDetail);
        } catch (err) {
            reject(err)
        }
    })
};
exports.getRegencyDetail=function(RegencyID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let regencyColl = database.collection('regencies');
            let regencyDetail = await regencyColl.findOne({ regency_code: RegencyID });
            resolve(regencyDetail);
        } catch (err) {
            reject(err)
        }
    })
};
exports.getProvinceDetail=function(ProvinceID) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let provinceColl = database.collection('provinces');
            let provinceDetail = await provinceColl.findOne({ province_code: ProvinceID });
            resolve(provinceDetail);
        } catch (err) {
            reject(err)
        }
    })
};
exports.getListProvinces=function() {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let provinceColl = database.collection('provinces');
            let provinces = await provinceColl.find().toArray();
            resolve(provinces);
        } catch (err) {
            reject(err)
        }
    })
};
exports.getListRegenciesByProvinceCode=function(ProvinceCode) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let regencyColl = database.collection('regencies');
            let regencies = await regencyColl.find({province_code:ProvinceCode}).toArray();
            resolve(regencies);
        } catch (err) {
            reject(err)
        }
    })
};
exports.getListDistrictsByRegencyCode=function(RegencyCode) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let districtColl = database.collection('districts');
            let districts = await districtColl.find({regency_code:RegencyCode}).toArray();
            resolve(districts);
        } catch (err) {
            reject(err)
        }
    })
};
exports.getListVillagesByDistrictCode=function(DistrictCode) {
    return new Promise(async (resolve, reject) => {
        try {
            let database = require('../app').database;
            let villageColl = database.collection('villages');
            let villages = await villageColl.find({district_code:DistrictCode}).toArray();
            resolve(villages);
        } catch (err) {
            reject(err)
        }
    })
};