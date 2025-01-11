import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { AuthGuard, CurrentUser, UserDto } from '@app/common';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @UseGuards(AuthGuard)
  @Post()
  public async create(
    @Body() createReservationDto: CreateReservationDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.reservationService.create(createReservationDto, user);
  }

  @UseGuards(AuthGuard)
  @Get()
  public async findAll(@CurrentUser() user: UserDto) {
    return this.reservationService.findAll(user);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  public async findOne(@Param('id') id: string, @CurrentUser() user: UserDto) {
    return this.reservationService.findOne(id, user);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.reservationService.update(id, updateReservationDto, user);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  public async remove(@Param('id') id: string, @CurrentUser() user: UserDto) {
    return this.reservationService.remove(id, user);
  }
}
