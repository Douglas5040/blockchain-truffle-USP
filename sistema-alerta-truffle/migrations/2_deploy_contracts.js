var VotoEnchente = artifacts.require("VotoEnchente");
//var Register = artifacts.require("Register");

module.exports = function(deployer) {
  deployer.deploy(VotoEnchente);
  //deployer.deploy(Register);
};
