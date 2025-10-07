import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import sequelize from "../../utils/config.utils";

export class BrochureSummary extends Model<
  InferAttributes<BrochureSummary>,
  InferCreationAttributes<BrochureSummary>
> {
  declare summary_id: CreationOptional<string>;
  declare product_id: string;
  declare product_name: string;
  declare product_code: string;
  declare insurer: string;
  declare description: string;
  declare effective_from: Date;
  declare effective_to: CreationOptional<Date>;
  declare variants: {
    variant_code: string;
    variant_label: string;
    summary: string;
  }[];
  declare eligibility_snapshot: string;
  declare notes: string;
  declare created_at: CreationOptional<Date>;
  declare updated_at: CreationOptional<Date>;
}

BrochureSummary.init(
  {
    summary_id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    product_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    insurer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    effective_from: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    effective_to: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    variants: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    eligibility_snapshot: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "brochure_summaries",
    timestamps: true,
    underscored: true,
  }
);

export type BrochureSummaryData = {
  summary_id?: string;
  product_id: string;
  product_name: string;
  product_code: string;
  insurer: string;
  description: string;
  effective_from: Date;
  effective_to?: Date;
  variants: Array<{
    variant_code: string;
    variant_label: string;
    summary: string;
  }>;
  eligibility_snapshot: string;
  notes: string;
};
