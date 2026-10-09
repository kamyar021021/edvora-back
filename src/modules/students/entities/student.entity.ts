import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

export type ProgramType = "weekly" | "monthly";
export type RateType = "hourly" | "per_session";
export type PaymentType = "per_session" | "lump_sum";

@Entity("students")
@Index(["userId"])
export class Student {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "uuid" })
  userId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 20 })
  phone: string;

  @Column({ type: "text", nullable: true })
  notes: string | null;

  @Column({ type: "varchar", length: 20 })
  programType: ProgramType;

  @Column({ type: "int" })
  sessionsCount: number;

  @Column({ type: "int" })
  sessionDuration: number;

  @Column({ type: "varchar", length: 20 })
  rateType: RateType;

  @Column({ type: "bigint" })
  rateAmount: number;

  @Column({ type: "varchar", length: 20 })
  paymentType: PaymentType;

  @Column({ type: "date" })
  startDate: string;

  @Column({ type: "varchar", length: 32, unique: true })
  shareToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}