import { AbstractRepository, UserDocument } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UsersRepository extends AbstractRepository<UserDocument> {
  protected logger: Logger = new Logger(UsersRepository.name);

  constructor(
    @InjectModel(UserDocument.name)
    protected readonly model: Model<UserDocument>,
  ) {
    super(model);
  }

  async findEmailExists(email: string) {
    const user = await this.model.findOne({ email });
    return !!user;
  }
}
