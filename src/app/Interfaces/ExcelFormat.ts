export interface ExcelFormat {
    index: number;
    Driver?:          string;
    Date?:            number | string;
    Account?:         string;
    Type?:            Type;
    Description?:     string;
    "Laborer Hours"?: number;
    Time?:            Date;
    Duration?:        string;
    Yards?:           number;
    totalAmount?: number;
}

export enum Type {
    ContainerServices = "Container Services",
    Laborers = "Laborers",
    LiveLoad = "Live Load",
    Other = "Other",
    RubbishRemoval = "Rubbish Removal",
}

export interface DriverRow{
Driver: string;
Date: string|undefined;
Account: string;
Duration: string;
totalAmount?: number;
}

export interface THourPerDriver{
  Driver: string;
  Date: string|undefined;
  Account: string;
  Duration: number|undefined;
  totalAmount?: number;
  }

