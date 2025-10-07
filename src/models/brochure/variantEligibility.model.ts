import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import sequelize from "../../utils/config.utils";

export class EligibilityMaster extends Model<
  InferAttributes<EligibilityMaster>,
  InferCreationAttributes<EligibilityMaster>
> {
  declare eligibility_id: CreationOptional<string>;
  declare eligibility_name: string;
  declare insurer: string;
  declare jurisdiction: "IN" | "PH" | "MY";
  declare channel: "pos" | "non_pos" | "any";
  declare pay_type: "single" | "regular" | "limited";
  declare ppt_rule_type: "fixed_years" | "range_years" | "relative_to_polterm";
  declare ppt_fixed_years: CreationOptional<number>;
  declare ppt_min_years: CreationOptional<number>;
  declare ppt_max_years: CreationOptional<number>;
  declare premium_modes:
    | "single"
    | "yearly"
    | "half_yearly"
    | "quarterly"
    | "monthly";
  declare min_policy_term_type: "fixed_years" | "age_less_entry" | "whole_life";
  declare max_policy_term_type: "fixed_years" | "age_less_entry" | "whole_life";
  declare min_entry_age: number;
  declare max_entry_age: number;
  declare min_maturity_age: number;
  declare max_maturity_age: number;
  declare min_policy_term_value: number;
  declare max_policy_term_value: number;
  declare min_base_sum_assured: number;
  declare max_base_sum_assured: number;
  declare currency: CreationOptional<string>;
  declare effective_from: CreationOptional<Date>;
  declare effective_to: CreationOptional<Date>;
  declare notes: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

EligibilityMaster.init(
  {
    eligibility_id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
    eligibility_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    insurer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    jurisdiction: {
      // type: DataTypes.ENUM("IN", "PH", "MY"),
      type: DataTypes.TEXT,
      allowNull: false,
    },
    channel: {
      // type: DataTypes.ENUM("pos", "non_pos", "any"),
      type: DataTypes.TEXT,
      defaultValue: "any",
    },
    pay_type: {
      // type: DataTypes.ENUM("single", "regular", "limited"),
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ppt_rule_type: {
      // type: DataTypes.ENUM("fixed_years", "range_years", "relative_to_polterm"),
      type: DataTypes.TEXT,
      allowNull: true,
    },
    ppt_fixed_years: {
      type: DataTypes.SMALLINT,
    },
    ppt_min_years: {
      type: DataTypes.SMALLINT,
    },
    ppt_max_years: {
      type: DataTypes.SMALLINT,
    },
    premium_modes: {
      // type: DataTypes.ENUM(
      //   "single",
      //   "yearly",
      //   "half_yearly",
      //   "quarterly",
      //   "monthly"
      // ),
      type: DataTypes.TEXT,
      allowNull: true,
    },
    min_policy_term_type: {
      // type: DataTypes.ENUM("fixed_years", "age_less_entry", "whole_life"),
      type: DataTypes.TEXT,
      allowNull: true,
    },
    max_policy_term_type: {
      // type: DataTypes.ENUM("fixed_years", "age_less_entry", "whole_life"),
      type: DataTypes.TEXT,
      allowNull: true,
    },
    min_entry_age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_entry_age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    min_maturity_age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_maturity_age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    min_policy_term_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    max_policy_term_value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    min_base_sum_assured: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      get() {
        const raw = this.getDataValue("min_base_sum_assured");
        return raw === null ? null : Number(raw);
      },
    },
    max_base_sum_assured: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
      get() {
        const raw = this.getDataValue("max_base_sum_assured");
        return raw === null ? null : Number(raw);
      },
    },
    currency: {
      type: DataTypes.TEXT,
      allowNull: true,
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
  {
    sequelize,
    tableName: "eligibility_master",
  }
);

export type EligibilityMasterData = {
  eligibility_id?: string;
  eligibility_name: string;
  insurer: string;
  jurisdiction: "IN" | "PH" | "MY";
  channel?: "pos" | "non_pos" | "any";
  pay_type: "single" | "regular" | "limited";
  ppt_rule_type: "fixed_years" | "range_years" | "relative_to_polterm";
  ppt_fixed_years?: number;
  ppt_min_years?: number;
  ppt_max_years?: number;
  premium_modes: "single" | "yearly" | "half_yearly" | "quarterly" | "monthly";
  min_policy_term_type: "fixed_years" | "age_less_entry" | "whole_life";
  max_policy_term_type: "fixed_years" | "age_less_entry" | "whole_life";
  min_entry_age: number;
  max_entry_age: number;
  min_maturity_age: number;
  max_maturity_age: number;
  min_policy_term_value: number;
  max_policy_term_value: number;
  min_base_sum_assured: number;
  max_base_sum_assured: number;
  currency?: string;
  effective_from?: Date;
  effective_to?: Date;
  notes?: string;
};
