import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import sequelize from "../../utils/config.utils";
import { EligibilityMaster } from "./variantEligibility.model";

export class VariantEligibilityLink extends Model<
  InferAttributes<VariantEligibilityLink>,
  InferCreationAttributes<VariantEligibilityLink>
> {
  declare link_id: CreationOptional<string>;
  declare variant_id: string;
  declare eligibility_id: string;
  declare override_json: CreationOptional<Record<string, any>>;
  declare priority: CreationOptional<number>;
  declare effective_from: CreationOptional<Date>;
  declare effective_to: CreationOptional<Date>;
  declare notes: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare eligibility?: EligibilityMaster;
}

VariantEligibilityLink.init(
  {
    link_id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    variant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "plan_variants",
        key: "variant_id",
      },
    },
    eligibility_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "eligibility_master",
        key: "eligibility_id",
      },
    },
    override_json: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: null,
    },
    priority: {
      type: DataTypes.SMALLINT,
      defaultValue: 1,
    },
    effective_from: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    effective_to: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: "variant_eligibility_link",
  }
);

export type VariantEligibilityLinkData = {
  link_id?: string;
  variant_id: string;
  eligibility_id: string;
  override_json?: Record<string, any>;
  priority?: number;
  effective_from?: Date;
  effective_to?: Date;
  notes?: string;
};
