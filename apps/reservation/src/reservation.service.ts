import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ReservationRepository } from './reservation.repository';
import { UserDto } from '@app/common';
import { CreateReservationDto, UpdateReservationDto } from './dto';
import { ReservationDocument } from './models/reservation.schema';

@Injectable()
export class ReservationService {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  /**
   * Creates a new reservation.
   * @param createReservationDto - The data transfer object containing reservation details.
   * @param user - The user creating the reservation.
   * @returns The created reservation.
   */
  public async create(
    createReservationDto: CreateReservationDto,
    user: UserDto,
  ): Promise<ReservationDocument> {
    return this.reservationRepository.create({
      ...createReservationDto,
      timeStamp: new Date(),
      userId: user._id,
    });
  }

  /**
   * Finds all reservations for a user.
   * @param user - The user whose reservations are to be found.
   * @returns An array of reservations.
   */
  public async findAll(user: UserDto): Promise<ReservationDocument[]> {
    return this.reservationRepository.find({ userId: user._id });
  }

  /**
   * Finds a single reservation by its ID.
   * @param id - The ID of the reservation to find.
   * @param user - The user requesting the reservation.
   * @returns The found reservation.
   * @throws UnauthorizedException if the user does not have permission to view the reservation.
   */
  public async findOne(
    id: string,
    user: UserDto,
  ): Promise<ReservationDocument> {
    const reservation = await this.reservationRepository.findOne({ _id: id });
    if (reservation.userId !== user._id) {
      throw new UnauthorizedException(
        'You do not have permission to view this reservation',
      );
    }
    return reservation;
  }

  /**
   * Updates a reservation.
   * @param id - The ID of the reservation to update.
   * @param updateReservationDto - The data transfer object containing updated reservation details.
   * @param user - The user requesting the update.
   * @returns The updated reservation.
   * @throws UnauthorizedException if the reservation is not found or the user does not have permission to update it.
   */
  public async update(
    id: string,
    updateReservationDto: UpdateReservationDto,
    user: UserDto,
  ): Promise<ReservationDocument> {
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

  /**
   * Removes a reservation.
   * @param _id - The ID of the reservation to remove.
   * @param user - The user requesting the removal.
   * @returns The removed reservation.
   * @throws UnauthorizedException if the reservation is not found or the user does not have permission to delete it.
   */
  public async remove(_id: string, user: UserDto): Promise<boolean> {
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
