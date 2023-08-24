const CostLabourFactor = require("../models/CostLabourFactor");

module.exports = async () => {
  const costLabourFactor = await new CostLabourFactor({ costLabourFactor: 1.2 });

  await costLabourFactor.save();

  console.log("[Database] Se corrió el seeder de cost labour factor");
};
