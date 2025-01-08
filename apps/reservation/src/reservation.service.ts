import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservation.repository';

@Injectable()
export class ReservationService {
  constructor(private readonly reservationRepository: ReservationRepository) {}
  public async create(createReservationDto: CreateReservationDto) {
    return this.reservationRepository.create({
      ...createReservationDto,
      timeStamp: new Date(),
      userId: '123',
    });
  }

  public async findAll() {
    return this.reservationRepository.find({});
  }

  public async findOne(id: string) {
    return this.reservationRepository.findOne({ _id: id });
  }

  public async update(id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate(
      { _id: id },
      { $set: updateReservationDto },
    );
  }

  public async remove(_id: string) {
    return this.reservationRepository.findOneAndDelete({ _id });
  }
}
