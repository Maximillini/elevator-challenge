import styles from './Elevator.module.scss'

export const Elevator = () => {
  return (
    <div className={styles.elevatorContainer}>
      <div className={styles.elevatorDisplay}>
        Doors Closed
      </div>
      <div className={styles.elevator}></div>
    </div>
  )
}