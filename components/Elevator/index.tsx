import { useState } from 'react'
import styles from './Elevator.module.scss'

export const Elevator = () => {
  const [doorsOpen, setdoorsOpen] = useState(false)
  const [currentFloor, setCurrentFloor] = useState(1)
  const [moving, setMoving] = useState(false)

  return (
    <div className={styles.elevatorContainer}>
      <div className={styles.elevatorDisplay}>
        Doors {doorsOpen ? 'Open' : 'Closed'}
        <br />
        Floor {currentFloor}
        <br />
        {moving ? 'Moving' : 'Stopped'}
        <div className={styles.elevatorDirection}>
          &uarr;
          &darr;
        </div>
      </div>
      <div className={styles.elevator}></div>
    </div>
  )
}