import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { Connection } from '../../connections/entities/connection.entity';
import { Education } from './education.entity';
import { Experience } from './experience.entity';
import { UserSkill } from './user-skill.entity';
import { Follow } from 'src/domain/followers/entities/follow.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column({ nullable: true })
  coverPicture?: string;

  @Column({ nullable: true })
  headline?: string;

  @Column({ type: 'text', nullable: true })
  about?: string;

  @OneToMany(() => Education, (education) => education.user, { cascade: true })
  educations: Education[];

  @OneToMany(() => Experience, (experience) => experience.user, {
    cascade: true,
  })
  experiences: Experience[];

  @OneToMany(() => UserSkill, (userSkill) => userSkill.user)
  skills: UserSkill[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  @OneToMany(() => Connection, (connection) => connection.sender)
  sentConnections: Connection[];

  @OneToMany(() => Connection, (connection) => connection.receiver)
  receivedConnections: Connection[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
