import { Model, InferAttributes, InferCreationAttributes, CreationOptional, DataTypes } from "sequelize";
import sequelize from "../../utils/config.utils";

export class MinPremiumRule extends Model<InferAttributes<MinPremiumRule>, InferCreationAttributes<MinPremiumRule>> {
  declare minprem_id: CreationOptional<string>;
  declare product_id: string;
  declare variant_id: CreationOptional<string>;
  declare pay_type: "single" | "regular" | "limited";
  declare premium_modes: "single" | "yearly" | "half_yearly" | "quarterly" | "monthly";
  declare currency: string;
  declare min_premium_per_install: number;
  declare effective_from: CreationOptional<Date>;
  declare effective_to: CreationOptional<Date>;
  declare notes: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

MinPremiumRule.init(
  {
    minprem_id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    variant_id: {
      type: DataTypes.UUID,
    },
    pay_type: {
      type: DataTypes.ENUM("single","regular","limited"),
      allowNull: false,
    },
    premium_modes: {
      type: DataTypes.ENUM("single","yearly","half_yearly","quarterly","monthly"),
      allowNull: false,
    },
    currency: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    min_premium_per_install: {
      type: DataTypes.DECIMAL(14,2),
      allowNull: false,
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

export type MinPremiumRuleData = {
  minprem_id?: string;
  product_id: string;
  variant_id?: string;
  pay_type: "single" | "regular" | "limited";
  premium_modes: "single" | "yearly" | "half_yearly" | "quarterly" | "monthly";
  currency: string;
  min_premium_per_install: number;
  effective_from?: Date;
  effective_to?: Date;
  notes?: string;
};