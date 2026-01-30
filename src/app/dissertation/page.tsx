import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export const metadata = {
  title: 'PhD Dissertation | Prasanth Kotaru',
  description: 'Dynamics and Control for Collaborative Aerial Manipulation - PhD Dissertation by Prasanth Kotaru',
}

export default function Dissertation()
{
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900 flex flex-col">
      <Header />
      <div className="flex-grow pt-24 px-6 pb-20">
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Dynamics and Control for Collaborative Aerial Manipulation
            </h1>
            <div className="flex flex-col items-center gap-4 text-gray-600 dark:text-gray-400">
              <p className="text-xl">PhD Dissertation, December 2022</p>
              <p className="font-medium">University of California, Berkeley</p>
              <a
                href="https://hybrid-robotics.berkeley.edu/publications/Dissertation2022_Prasanth_Kotaru.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors mt-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </a>
            </div>
          </header>

          {/* Abstract */}
          <section className="mb-16 prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">Abstract</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              Aerial vehicles for physical interactions as a form of a freely-floating manipulator are of growing interest in recent times. Aerial vehicles like quadrotors enable us to address issues such as last-mile delivery and search & rescue. Using multiple such vehicles collaboratively increases the scope of manipulation beyond what a single vehicle can achieve. This dissertation presents theoretical and experimental contributions toward using multiple quadrotors for collaborative tasks, with an emphasis on cable-suspended payloads.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mt-4">
              The dissertation studies the problem of collaborative aerial manipulation from two overarching views. The first half of the dissertation has an “individualistic view” and presents methods and algorithms for a single quadrotor/quadrotor with a cable-suspended payload. An L1 adaptation scheme is implemented on a geometric attitude control for the quadrotor on SO(3) in the presence of model uncertainties and disturbances. Next, the extended Kalman filter is modified to estimate states on S². The concept of variation on manifolds is employed to linearize the system states and compute the variations in the state. Optimal and obstacle-free trajectories for a quadrotor with a suspended payload are generated using direct collocation. The planning method exploits the differential flatness for generating the trajectories in the flat space and converts non-differentiable obstacle avoidance constraints into smooth constraints using dual variables.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg mt-4">
              The second part of the dissertation has a “collaborative view” and presents results for two types of aerial manipulation, multiple quadrotors carrying a payload using suspended cables (parallel-aerial-manipulator) and a series of quadrotors connected using a flexible cable (serial-aerial-manipulator). The dissertation presents experimental results for grasping and controlling payload using a cable-suspended gripper using more than one quadrotor. Finally, the dissertation models and computes coordinate-free geometric dynamics for multiple quadrotors connected in series using a single flexible cable and shows that the system is differentially-flat.
            </p>
          </section>

          {/* Chapters / Contributions */}
          <section className="space-y-16">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-800 pb-2">Chapters</h2>

            {/* Contribution 1 */}
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Geometric L₁ Adaptive Attitude Control on SO(3)
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Implemented an L1 adaptation scheme on geometric attitude control for quadrotors to handle model uncertainties and disturbances robustly.
                  </p>
                  <a href="https://doi.org/10.1115/1.4045558" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                    📄 Read Paper (ASME J. DSMC 2020)
                  </a>
                </div>
                <div className="aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
                  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/nBDDxpkz6Pg" title="Geometric L1 Adaptive Control" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
              </div>
            </div>

            {/* Contribution 2 */}
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Variation-based Extended Kalman Filter on S²
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Developed a modified Extended Kalman Filter (EKF) to estimate states on the S² manifold, utilizing the concept of variation on manifolds for linearization.
              </p>
              <a href="https://ieeexplore.ieee.org/abstract/document/8795986" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                📄 Read Paper (ECC 2019)
              </a>
            </div>

            {/* Contribution 3 */}
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Direct Collocation for Quadrotor with Suspended Payload
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Generated optimal and obstacle-free trajectories using direct collocation, exploiting differential flatness and handling non-differentiable constraints.
                  </p>
                  <a href="https://doi.org/10.1109/LRA.2020.2972845" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                    📄 Read Paper (IEEE RA-L 2020)
                  </a>
                </div>
                <div className="aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
                  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/e09RZOx_nZk" title="Direct Collocation Path Planning" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
              </div>
            </div>

            {/* Contribution 4 */}
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Collaborative Aerial Manipulation & Grasping
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Experimental results for grasping and controlling a payload using a cable-suspended gripper with multiple collaborative quadrotors.
                  </p>
                  <a href="https://hybrid-robotics.berkeley.edu/publications/Dissertation2022_Prasanth_Kotaru.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                    📄 Read in Dissertation
                  </a>
                </div>
                <div className="aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
                  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/Bo1-U9dzL-M" title="Collaborative Aerial Grasping" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
              </div>
            </div>

            {/* Contribution 5 */}
            <div className="bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Geometric Modeling for Flexible Cable Systems
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">
                    Modeled geometric dynamics for multiple quadrotors connected in series by a flexible cable, demonstrating differential flatness of the system.
                  </p>
                  <a href="https://doi.org/10.1016/j.ifacol.2020.12.1396" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium inline-flex items-center gap-1 mb-2">
                    📄 Read Paper (IFAC 2020)
                  </a>
                  <br />
                  <a href="https://github.com/HybridRobotics/multiple-quadrotor-flexible-hose" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium inline-flex items-center gap-1">
                    💻 View Code (GitHub)
                  </a>
                </div>
                <div className="aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
                  <iframe width="100%" height="100%" src="https://www.youtube.com/embed/i3egJ4fcAKM" title="Flexible Cable Dynamics" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
              </div>
            </div>

          </section>
        </article>
      </div>
      <Footer />
    </main>
  )
}
