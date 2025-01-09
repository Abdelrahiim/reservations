import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservation.repository';
import { UserDto } from '@app/common';

@Injectable()
export class ReservationService {
  constructor(private readonly reservationRepository: ReservationRepository) {}
  public async create(
    createReservationDto: CreateReservationDto,
    user: UserDto,
  ) {
    return this.reservationRepository.create({
      ...createReservationDto,
      timeStamp: new Date(),
      userId: user._id,
    });
  }

  public async findAll(user: UserDto) {
    return this.reservationRepository.find({ userId: user._id });
  }

  public async findOne(id: string, user: UserDto) {
    const reservation = await this.reservationRepository.findOne({ _id: id });
    if (reservation.userId !== user._id) {
      throw new UnauthorizedException(
        'You do not have permission to view this reservation',
      );
    }
    return reservation;
  }

  public async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
    user: UserDto,
  ) {
    const reservation = await this.reservationRepository.findOne({ _id: id });
    if (!reservation) {
      throw new UnauthorizedException('Reservation not found');
    }
    if (reservation.userId !== user._id) {
      throw new UnauthorizedException(
        'You do not have permission to update this reservation',
      );
    }
    return this.reservationRepository.findOneAndUpdate(
      { _id: id, userId: user._id },
      { $set: updateReservationDto },
    );
  }

  public async remove(_id: string, user: UserDto) {
    const reservation = await this.reservationRepository.findOne({ _id });
    if (!reservation) {
      throw new UnauthorizedException('Reservation not found');
    }
    if (reservation.userId !== user._id) {
      throw new UnauthorizedException(
        'You do not have permission to delete this reservation',
      );
    }
    return this.reservationRepository.findOneAndDelete({
      _id,
      userId: user._id,
    });
  }
}
