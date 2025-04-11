import { IStorage } from "./storageInterface";
import { DatabaseStorage } from "./dbStorage";

// Export a factory function to create the storage implementation
export function createStorage(): IStorage {
  return new DatabaseStorage();
}