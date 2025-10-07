import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import sequelize from "../../utils/config.utils";
import { EligibilityMasterData } from "./variantEligibility.model";

export class PlanVariant extends Model<
  InferAttributes<PlanVariant>,
  InferCreationAttributes<PlanVariant>
> {
  declare variant_id: CreationOptional<string>;
  declare product_id: string;
  declare variant_code: string;
  declare variant_label: string;
  declare variant_description: CreationOptional<string>;
  declare effective_from: CreationOptional<Date>;
  declare effective_to: CreationOptional<Date>;
  declare notes: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

PlanVariant.init(
  {
    variant_id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    variant_code: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    variant_label: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    variant_description: {
      type: DataTypes.TEXT,
    },
    effective_from: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    effective_to: {
      type: DataTypes.DATE,
    },
    notes: {
      type: DataTypes.TEXT,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  { sequelize }
);

export type PlanVariantData = {
  variant_id?: string;
  product_id: string;
  variant_code: string;
  variant_label: string;
  variant_description?: string;
  effective_from?: Date;
  effective_to?: Date;
  notes?: string;
};

export type PlanVariantDataforAI = {
  variant_id?: string;
  product_id: string;
  variant_code: string;
  variant_label: string;
  variant_description?: string;
  effective_from?: Date;
  effective_to?: Date;
  notes?: string;
  eligibility: EligibilityMasterData[];
};
