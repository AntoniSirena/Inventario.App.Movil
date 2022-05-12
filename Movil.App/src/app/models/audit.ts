export abstract class  Audit {
    CreationTime: string;
    CreatorUserId: string;
    LastModificationTime: string;
    LastModifierUserId: number;
    DeleterUserId: number;
    DeletionTime: string;
    IsActive: boolean;
    IsDeleted: boolean;
}
