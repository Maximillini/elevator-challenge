import { Call } from '../../types/elevator'
import styles from './Tenant.module.scss'

export const Tenant = ({ call }: { call: Call }) => {
  return (
    <div className={styles.tenantContainer}>
      <div>Start: {call.currentFloor}</div>
      <div>Dest: {call.destination}</div>
    </div>
  )
}