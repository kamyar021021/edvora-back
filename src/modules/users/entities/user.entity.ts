import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({ type: "varchar", length: 20, unique: true })
  phone!: string;

  @Column({ type: "varchar", select: false })
  password!: string;

  @Column({ type: "boolean", default: false })
  isAdmin!: boolean;

  @Column({ type: "boolean", default: false })
  isSuspended!: boolean;

  @Column({ type: "text", nullable: true })
  adminNote!: string | null;

  @Column({ type: "timestamptz", nullable: true })
  lastLoginAt!: Date | null;

  @Column({ type: "int", default: 0 })
  loginCount!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}