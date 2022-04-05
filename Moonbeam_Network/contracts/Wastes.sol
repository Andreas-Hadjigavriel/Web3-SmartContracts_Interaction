// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16;
pragma experimental ABIEncoderV2;

contract Wastes {
    uint256 internal wasteId = 0;
    address owner;

    constructor() public{
        owner = msg.sender;
    }   

    modifier _ownerOnly(){
        require(msg.sender == owner);
        _;
    }

    struct Waste {
        uint id;
        uint date;
        string time;
        string driverName;
        string location;
        string route;
        string binID;
        // except -> instal_c ,  hash , quality, material, pass, coordinates, kg, wastType
    }

    mapping(uint256 => Waste) wastes;

    function setWasteData(  uint256 _date, 
                            string memory _time, 
                            string memory _driverName, string memory _location, 
                            string memory _route, string memory _binID) 
    public _ownerOnly payable {
        wastes[wasteId] = Waste(
                        wasteId, _date, _time, 
                        _driverName, _location, 
                        _route, _binID
        );
        wasteId++;
    }

    function getWasteData() external view _ownerOnly returns (Waste[] memory){
      Waste[] memory id = new Waste[](wasteId);
      for (uint i = 0; i < wasteId; i++) {
          Waste storage waste1 = wastes[i];
          id[i] = waste1;
      }
      return id;
    }

}





    

