// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title ProductOwnership
 * @dev Smart contract for tracking product ownership history on EcoFinds marketplace
 * Deployable on Polygon testnet
 */
contract ProductOwnership is Ownable, ReentrancyGuard {
    
    struct OwnershipRecord {
        address previousOwner;
        address newOwner;
        uint256 timestamp;
        string txHash;
        bool exists;
    }
    
    struct Product {
        string productId;
        address currentOwner;
        bool exists;
        uint256 transferCount;
    }
    
    // Mapping from product blockchain ID to product info
    mapping(string => Product) public products;
    
    // Mapping from product ID to array of ownership records
    mapping(string => OwnershipRecord[]) public ownershipHistory;
    
    // Mapping to track registered users
    mapping(address => bool) public registeredUsers;
    
    // Events
    event ProductRegistered(string indexed productId, address indexed owner);
    event OwnershipTransferred(
        string indexed productId, 
        address indexed previousOwner, 
        address indexed newOwner,
        uint256 timestamp
    );
    event UserRegistered(address indexed user);
    
    modifier onlyRegisteredUser() {
        require(registeredUsers[msg.sender], "User not registered");
        _;
    }
    
    modifier productExists(string memory productId) {
        require(products[productId].exists, "Product does not exist");
        _;
    }
    
    modifier onlyProductOwner(string memory productId) {
        require(products[productId].currentOwner == msg.sender, "Not the product owner");
        _;
    }
    
    constructor() {}
    
    /**
     * @dev Register a new user
     */
    function registerUser() external {
        registeredUsers[msg.sender] = true;
        emit UserRegistered(msg.sender);
    }
    
    /**
     * @dev Register a new product with initial owner
     * @param productId Unique blockchain ID for the product
     */
    function registerProduct(string memory productId) external onlyRegisteredUser {
        require(!products[productId].exists, "Product already exists");
        
        products[productId] = Product({
            productId: productId,
            currentOwner: msg.sender,
            exists: true,
            transferCount: 0
        });
        
        // Add initial ownership record
        ownershipHistory[productId].push(OwnershipRecord({
            previousOwner: address(0),
            newOwner: msg.sender,
            timestamp: block.timestamp,
            txHash: "",
            exists: true
        }));
        
        emit ProductRegistered(productId, msg.sender);
    }
    
    /**
     * @dev Transfer ownership of a product to a new owner
     * @param productId The blockchain ID of the product
     * @param newOwner Address of the new owner
     */
    function transferOwnership(string memory productId, address newOwner) 
        external 
        nonReentrant
        onlyRegisteredUser
        productExists(productId)
        onlyProductOwner(productId)
    {
        require(newOwner != address(0), "Invalid new owner address");
        require(newOwner != msg.sender, "Cannot transfer to yourself");
        require(registeredUsers[newOwner], "New owner not registered");
        
        address previousOwner = products[productId].currentOwner;
        
        // Update product owner
        products[productId].currentOwner = newOwner;
        products[productId].transferCount++;
        
        // Add ownership record
        ownershipHistory[productId].push(OwnershipRecord({
            previousOwner: previousOwner,
            newOwner: newOwner,
            timestamp: block.timestamp,
            txHash: "",
            exists: true
        }));
        
        emit OwnershipTransferred(productId, previousOwner, newOwner, block.timestamp);
    }
    
    /**
     * @dev Get current owner of a product
     * @param productId The blockchain ID of the product
     * @return Address of current owner
     */
    function getCurrentOwner(string memory productId) 
        external 
        view 
        productExists(productId)
        returns (address) 
    {
        return products[productId].currentOwner;
    }
    
    /**
     * @dev Get ownership history length for a product
     * @param productId The blockchain ID of the product
     * @return Number of ownership records
     */
    function getOwnershipHistoryLength(string memory productId) 
        external 
        view 
        productExists(productId)
        returns (uint256) 
    {
        return ownershipHistory[productId].length;
    }
    
    /**
     * @dev Get specific ownership record
     * @param productId The blockchain ID of the product
     * @param index Index of the ownership record
     * @return Ownership record details
     */
    function getOwnershipRecord(string memory productId, uint256 index)
        external
        view
        productExists(productId)
        returns (
            address previousOwner,
            address newOwner,
            uint256 timestamp,
            string memory txHash
        )
    {
        require(index < ownershipHistory[productId].length, "Invalid index");
        
        OwnershipRecord memory record = ownershipHistory[productId][index];
        return (
            record.previousOwner,
            record.newOwner,
            record.timestamp,
            record.txHash
        );
    }
    
    /**
     * @dev Get complete ownership history for a product
     * @param productId The blockchain ID of the product
     * @return Arrays of ownership history data
     */
    function getCompleteOwnershipHistory(string memory productId)
        external
        view
        productExists(productId)
        returns (
            address[] memory previousOwners,
            address[] memory newOwners,
            uint256[] memory timestamps
        )
    {
        uint256 length = ownershipHistory[productId].length;
        
        previousOwners = new address[](length);
        newOwners = new address[](length);
        timestamps = new uint256[](length);
        
        for (uint256 i = 0; i < length; i++) {
            OwnershipRecord memory record = ownershipHistory[productId][i];
            previousOwners[i] = record.previousOwner;
            newOwners[i] = record.newOwner;
            timestamps[i] = record.timestamp;
        }
        
        return (previousOwners, newOwners, timestamps);
    }
    
    /**
     * @dev Get product info
     * @param productId The blockchain ID of the product
     * @return Product details
     */
    function getProductInfo(string memory productId)
        external
        view
        productExists(productId)
        returns (
            string memory,
            address currentOwner,
            uint256 transferCount
        )
    {
        Product memory product = products[productId];
        return (
            product.productId,
            product.currentOwner,
            product.transferCount
        );
    }
}
