import { PossibleFloors, Direction, Call } from '../types/elevator'

export const randomFloor = () => (Math.floor(Math.random() * 20) + 1) as PossibleFloors

export const getRandStartAndDestination = () => {
  const start = randomFloor()
  const destination = randomFloor()

  return [start, destination]
}

export const randomDirection = Math.random() < 0.5 ? Direction.UP : Direction.DOWN

export const getTenantDirection = (startingFloor: PossibleFloors, destination: PossibleFloors) => {
  if (startingFloor === 1 || startingFloor < destination) return Direction.UP
  if (startingFloor === 20 || startingFloor > destination) return Direction.DOWN

  return randomDirection
}

export const isWithinPossibleFloors = (floor: number) => floor >= 1 && floor <= 20

export const isTenantMovingInSameDirection = (currentFloor: PossibleFloors, currentCall: Call, nextCall: Call) => {
  // if nextCall.direction === up && nextCall.dest > currentFloor && 
  if (nextCall.direction === currentCall.direction) {

  }
}