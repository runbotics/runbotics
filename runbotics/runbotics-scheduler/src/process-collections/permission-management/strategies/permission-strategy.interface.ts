import { EntityManager } from 'typeorm';

export interface PermissionStrategy {
    execute(entityManager?: EntityManager): Promise<void>;
}
