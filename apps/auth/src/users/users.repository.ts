import { AbstractRepository, UserDocument } from '@app/common';
import { Inject, Injectable, Logger } from '@nestjs/common';
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
		console.log("🚀 ~ UsersRepository ~ findEmailExists ~ email:", email)
		const user = await this.model.findOne({ email });
		return !!user;
	}
}
