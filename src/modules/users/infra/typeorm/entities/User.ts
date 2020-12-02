/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable camelcase */
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import uploadConfig from '../../../../../configurations/upload.config';

@Entity('users')
class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column()
  avatar: string;

  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    if (this.avatar === null) return null;
    switch (uploadConfig.driver) {
      case 'disk':
        return this.avatar ? `${process.env.URL_API}files/${this.avatar}` : null;
      case 's3':
        return `https://${process.env.AWS_S3_BUCKET_NAME}.s3-us-west-1.amazonaws.com/${this.avatar}`;
      default:
        return null;
    }
  }
}
export default User;
