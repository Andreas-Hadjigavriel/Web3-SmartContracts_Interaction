// SPDX-License-Identifier: MIT
pragma solidity >=0.5.16;
pragma experimental ABIEncoderV2;

contract Routes{

    uint256 internal routeId = 0;
    address owner;

    constructor() public{
        owner = msg.sender;
    }   

    modifier _ownerOnly(){
        require(msg.sender == owner);
        _;
    }

    struct Route{
        uint id;
        uint date;
        string time;        
        string driverName; 
        string location;
        string routeBinId;
        // except hash, coordinates, kg
    }

    mapping(uint256 => Route) routes;

    function setRouteData(  uint256 _date, string memory _time,
                            string memory _driverName, string memory _location,
                            string memory _routeBinId)
    public _ownerOnly payable {
        routes[routeId] = Route(routeId, _date, _time, _driverName, _location, _routeBinId);
        routeId++;
    }

    function getRouteData() external view _ownerOnly returns (Route[] memory){
      Route[] memory id = new Route[](routeId);
      for (uint i = 0; i < routeId; i++) {
          Route storage route1 = routes[i];
          id[i] = route1;
      }
      return id;
    }
  


   
}