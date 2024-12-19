import ContractorNavbar from '@/components/ContractorNavbar'
import React from 'react'
import Link from 'next/link'

const page = () => {
  return (
    <>
    <ContractorNavbar/>
    <section>
    <div className="card bg-base-100 w-96 shadow-xl w-full">
        <div className="card-body">
            <h2 className="card-title">Orders</h2>
            <p>Click the button below to view all your orders</p>
            <div className="card-actions justify-end">
                <button className="btn btn-primary"><Link href="/contractor-dashboard/orders">View</Link></button>
            </div>
        </div>
    </div><br />
    <div className="card bg-base-100 w-96 shadow-xl w-full">
        <div className="card-body">
            <h2 className="card-title">Quotes</h2>
            <p>Click the button below to view all your quotes</p>
            <div className="card-actions justify-end">
                <button className="btn btn-primary"><Link href="/contractor-dashboard/quotes">View</Link></button>
            </div>
        </div>
    </div><br />
    <div className="card bg-base-100 w-96 shadow-xl w-full">
        <div className="card-body">
            <h2 className="card-title">Bills</h2>
            <p>Click the button below to view all bills</p>
            <div className="card-actions justify-end">
                <button className="btn btn-primary"><Link href="/contractor-dashboard/bills">View</Link></button>
            </div>
        </div>
    </div><br />
    <div className="card bg-base-100 w-96 shadow-xl w-full">
        <div className="card-body">
            <h2 className="card-title">Report</h2>
            <p>Click the button below to view all your report</p>
            <div className="card-actions justify-end">
                <button className="btn btn-primary"><Link href="/contractor-dashboard/report">View</Link></button>
            </div>
        </div>
    </div>
    </section>
    </>
  )
}

export default page
