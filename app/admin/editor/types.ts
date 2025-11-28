export interface EditorFormData {
    id: string;
    title: string;
    description: string;

    // Upload Config
    allowedTypes: string;
    maxSizeMB: number;
    driveEnabled: boolean;
    driveFolderId: string;
    driveFolderUrl: string;
    driveFolderName: string;

    // Access Control
    isAcceptingResponses: boolean;
    expiryDate: string | null;
    isPublished: boolean;
    accessLevel: "ANYONE" | "INVITED";
    allowedEmails: string;
    emailFieldControl: "REQUIRED" | "OPTIONAL" | "NOT_INCLUDED";

    // Organization
    enableMetadataSpreadsheet: boolean;
    subfolderOrganization: "NONE" | "DATE" | "SUBMITTER" | "CUSTOM";
    customSubfolderField: string;
    enableSmartGrouping: boolean;

    // Design
    logoUrl: string;
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    fontFamily: string;
    buttonTextColor: string;
    cardStyle: "shadow" | "flat" | "border";
    borderRadius: "none" | "sm" | "md" | "lg" | "full";
    coverImageUrl: string;

    // Dynamic Fields
    uploadFields: UploadField[];
    customQuestions: CustomQuestion[];
}

export interface UploadField {
    id: string;
    label: string;
    allowedTypes: string;
    maxSizeMB: number;
    required: boolean;
}

export interface CustomQuestion {
    id: string;
    type: string;
    label: string;
    required: boolean;
    options?: string[];
}
