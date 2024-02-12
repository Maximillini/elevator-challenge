import { useState, useEffect } from 'react'
import { getRandStartAndDestination, getTenantDirection } from '../../helpers/elevator-helpers'
import { PossibleFloors, Direction, Call } from '../../types/elevator'
import styles from './Elevator.module.scss'

export const Elevator = () => {
  const [doorsOpen, setDoorsOpen] = useState(true)
  const [currentFloor, setCurrentFloor] = useState<PossibleFloors>(1)
  const [moving, setMoving] = useState(false)
  const [direction, setDirection] = useState<Direction | null>(null)
  const [pendingCalls, setPendingCalls] = useState<Call[]>([])
  const [elevatorPassengers, setElevatorPassengers] = useState<Call[]>([])
  const [emergencyStop, setEmergencyStop] = useState(false)

  useEffect(() => {
    const nextCall = pendingCalls[0]
  
    if (!nextCall || moving) {
      setCurrentFloor(1)
      setDoorsOpen(true)
      setMoving(false)
      setDirection(null)
      return
    }
  
    const direction = nextCall.currentFloor > currentFloor ? Direction.UP : Direction.DOWN;
  
    // Set the direction state before moving the elevator
    setDirection(direction)
  
    const moveOneFloor = () => {
      if (emergencyStop) return
      // Ensure the elevator is not already moving
      if (moving) return
    
      // Calculate the direction based on the next call's starting floor
      const direction = nextCall.currentFloor > currentFloor ? Direction.UP : Direction.DOWN;
    
      // Set the direction state
      setDirection(direction)
    
      // Move the elevator one floor at a time based on the direction
      setTimeout(() => {
        if (direction === Direction.UP && currentFloor < 20) {
          setCurrentFloor(prevFloor => prevFloor + 1 as PossibleFloors)
        } else if (direction === Direction.DOWN && currentFloor > 1) {
          setCurrentFloor(prevFloor => prevFloor - 1 as PossibleFloors)
        } else {
          // Stop the elevator when it reaches the destination floor
          setMoving(false)
          setDoorsOpen(true)
          return
        }
    
        const reachedDestination = currentFloor === nextCall.destination
        if (reachedDestination) {
          // Remove the completed call and stop the elevator
          setPendingCalls(prevCalls => prevCalls.filter(c => c !== nextCall))
          setMoving(false)
          setDoorsOpen(true)
          return
        }
    
        // Check for passengers to pick up
        const passengersToPickUp = pendingCalls.filter(call => {
          if (direction === Direction.UP) {
            return call.currentFloor === currentFloor && call.direction === Direction.UP;
          }
          if (direction === Direction.DOWN) {
            return call.currentFloor === currentFloor && call.direction === Direction.DOWN;
          }
        })
    
        if (passengersToPickUp.length > 0) {
          setPendingCalls(prevCalls => prevCalls.filter(call => !passengersToPickUp.includes(call)))
          setElevatorPassengers(prevPassengers => [...prevPassengers, ...passengersToPickUp])
        }
      }, 2000)
    }
  
    moveOneFloor()
  
  }, [moving, doorsOpen, pendingCalls, currentFloor, direction, emergencyStop])

  useEffect(() => {
    const getTenantCall = () => {
      const [start, destination] = getRandStartAndDestination()
      const randomDirection = getTenantDirection(start, destination)
      
      // Prevent requesting elevator to the same floor
      // In future iterations, make this impossible to achieve in getRandStartAndDestination() 
      if (start === destination) return
    
      if (pendingCalls.some(call => call.currentFloor === start && call.direction === randomDirection)) return
    
      // Stop after one tenant just to test issues
      if (pendingCalls.length > 10) return
      setPendingCalls(prevCalls => [...prevCalls, { currentFloor: start, direction: randomDirection, destination: destination }])
    }

    const interval = setInterval(() => {
      getTenantCall()
    }, 10000)

    return () => clearInterval(interval)
  }, [pendingCalls])

  // Move to separate component with floor number, and tenant on floor props
  const renderFloors = () => {
    const floors = []

    for (let i = 20; i >= 1; i--) {
      const tenantsOnFloor = pendingCalls.filter(call => call.currentFloor === i).length
      
      floors.push(
        <div key={i} className={styles.floor}>
          <div className={tenantsOnFloor ? styles.tenant : ''}>{`tenantsOnFloor: ${tenantsOnFloor}`}</div>
          <div className={`${styles.floorNumber} ${currentFloor === i ? styles.activeFloor : ''}`}>Floor {i}</div>
        </div>
      )
    }
    return floors
  }

  return (
    <div className={styles.elevatorContainer}>
      <div className={styles.displayContainer}>
        <div className={`${styles.elevatorDisplay} ${emergencyStop ? styles.emergencyStop : ''}`}>
          Doors {doorsOpen ? 'Open' : 'Closed'}
          <br />
          Floor {currentFloor}
          <br />
          {moving ? 'Moving' : 'Stopped'}
          <br />
          {emergencyStop ? 'EMERGENCY, PLEASE REMAIN CALM' : ''}
          <div className={styles.elevatorDirection}>
            <span className={direction === Direction.UP ? styles.up : ''}>&uarr;</span>
            <span className={direction === Direction.DOWN ? styles.down : ''}>&darr;</span>
          </div>
        </div>
        {/* Make this a toggle */}
        <button onClick={() => setEmergencyStop(true)} className={styles.emergencyStop}>Emergency Stop</button>
        {/* Move below to separate component */}
        {pendingCalls.map((call) => {
          return (<>
            <br/>
            currentFloor: {call.currentFloor}&nbsp;
            dest: {call.destination}&nbsp;
            direction: {call.direction} 
          </>
        )})}
      </div>
      <div className={styles.elevator}>
        <span className={doorsOpen ? '' : styles.doorClosed}></span>
        <span className={doorsOpen ? '' : styles.doorClosed}></span>
      </div>
      <div className={styles.floors}>{renderFloors()}</div>
    </div>
  )
}
