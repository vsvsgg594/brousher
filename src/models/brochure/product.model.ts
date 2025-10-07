import {
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  DataTypes,
} from "sequelize";
import sequelize from "../../utils/config.utils";

export class Product extends Model<
  InferAttributes<Product>,
  InferCreationAttributes<Product>
> {
  declare product_id: CreationOptional<string>;
  declare UIN: string;
  declare product_name: string;
  declare insurer: string;
  declare jurisdiction: "IN" | "PH" | "MY";
  declare currency: string;
  declare product_tagline: CreationOptional<string>;
  declare product_version: string;
  declare effective_from: CreationOptional<Date>;
  declare effective_to: CreationOptional<Date>;
  declare notes: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Product.init(
  {
    product_id: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      primaryKey: true
    },
    UIN: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    product_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    insurer: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    jurisdiction: {
      type: DataTypes.ENUM("IN", "PH", "MY"),
      allowNull: false,
    },
    currency: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    product_tagline: {
      type: DataTypes.TEXT,
    },
    product_version: {
      type: DataTypes.TEXT,
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

export type ProductData = {
  UIN: string;
  product_name: string;
  insurer: string;
  jurisdiction: "IN" | "PH" | "MY";
  currency: string;
  product_tagline?: string;
  product_version: string;
  effective_from?: Date;
  effective_to?: Date;
  notes?: string;
};
