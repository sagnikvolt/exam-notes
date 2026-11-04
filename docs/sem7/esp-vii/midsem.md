---
title: ESP VII — Mid Sem Q&A
hide: [toc]
---

# Essential Studies for Professionals VII — Mid Sem

!!! warning "Revision set, not a question bank"
    No question bank was available for this paper. These questions are my own picks from the syllabus (GATE Electrical, Power Systems and Power Electronics), ordered by how testable the topic is. Check anything unusual against your class notes.

## Syllabus

1. **Power Systems:** bus admittance matrix, Gauss-Seidel and Newton-Raphson load flow, voltage and frequency control, power factor correction, symmetrical components, symmetrical and unsymmetrical fault analysis, overcurrent / differential / distance protection, circuit breakers, stability concepts, equal area criterion.
2. **Power Electronics:** characteristics of diode, thyristor, TRIAC, GTO, MOSFET, IGBT; buck, boost and buck-boost converters; single and three phase uncontrolled rectifiers; line commutated thyristor converters; bidirectional AC to DC converters; line current harmonics, power factor, distortion factor; single and three phase inverters; sinusoidal PWM.

**Reference:** GATE Electrical Engineering (G.K. Publications), Chapters 5 and 10.

## Q1. Explain symmetrical components and write the transformation equations. <small>(5 marks · Module 1 · Mid Sem)</small>

- **Idea:** any unbalanced set of three phasors can be split into three balanced sets: positive, negative and zero sequence.
- **Positive sequence:** three equal phasors 120° apart in the normal order a-b-c.
- **Negative sequence:** three equal phasors 120° apart in the reverse order a-c-b.
- **Zero sequence:** three equal phasors in phase with each other.
- **Equations:** with $a=1\angle120^\circ$, $V_a=V_0+V_1+V_2$, $V_b=V_0+a^2V_1+aV_2$, $V_c=V_0+aV_1+a^2V_2$, and $V_0=\tfrac13(V_a+V_b+V_c)$, $V_1=\tfrac13(V_a+aV_b+a^2V_c)$, $V_2=\tfrac13(V_a+a^2V_b+aV_c)$.

## Q2. Show how the sequence networks are connected for LG, LL and LLG faults. <small>(5 marks · Module 1 · Mid Sem)</small>

- **Sequence networks:** each of positive, negative and zero sequence has its own network, with the source only in the positive one.
- **LG fault:** the three networks are in series, so $I_{a1}=I_{a2}=I_{a0}=\dfrac{E}{Z_1+Z_2+Z_0}$ and $I_f=3I_{a0}$.
- **LL fault:** only positive and negative networks are used, in parallel, with $I_{a0}=0$ and $I_{a1}=-I_{a2}=\dfrac{E}{Z_1+Z_2}$.
- **LLG fault:** all three networks are in parallel, with $I_{a1}=\dfrac{E}{Z_1+\dfrac{Z_2Z_0}{Z_2+Z_0}}$.
- **3-phase fault:** only the positive network is used, with $I_f=E/Z_1$.

## Q3. A generator has $E=1$ pu, $Z_1=Z_2=j0.2$ pu and $Z_0=j0.1$ pu. Find the fault current for a single line-to-ground fault. <small>(5 marks · Module 1 · Mid Sem)</small>

- **Series connection:** for an LG fault the three sequence networks are in series.
- **Total impedance:** $Z_1+Z_2+Z_0=j0.2+j0.2+j0.1=j0.5$ pu.
- **Sequence current:** $I_{a1}=\dfrac{E}{j0.5}=-j2$ pu, and $I_{a2}=I_{a0}=I_{a1}$.
- **Fault current:** $I_f=3I_{a1}=-j6$ pu.
- **Answer:** the fault current is $6$ pu, lagging the voltage by 90°.

## Q4. Form the bus admittance matrix for a 3-bus system with line impedances $j0.1$ (1-2), $j0.2$ (1-3) and $j0.05$ (2-3) pu. <small>(5 marks · Module 1 · Mid Sem)</small>

- **Line admittances:** $y_{12}=\dfrac1{j0.1}=-j10$, $y_{13}=-j5$, $y_{23}=-j20$.
- **Diagonal terms:** each is the sum of the admittances connected to that bus, so $Y_{11}=-j15$, $Y_{22}=-j30$, $Y_{33}=-j25$.
- **Off-diagonal terms:** each is the negative of the line admittance, so $Y_{12}=j10$, $Y_{13}=j5$, $Y_{23}=j20$.
- **Matrix:** $Y_{bus}=j\begin{bmatrix}-15&10&5\\10&-30&20\\5&20&-25\end{bmatrix}$.
- **Check:** the matrix is symmetric and every row sums to zero, because there are no shunt elements.

## Q5. Compare the Gauss-Seidel and Newton-Raphson load flow methods. <small>(5 marks · Module 1 · Mid Sem)</small>

- **Gauss-Seidel:** solves $V_i^{(k+1)}$ bus by bus from the latest values. It is simple and needs little memory.
- **Gauss-Seidel convergence:** linear, so it needs many iterations, and the count grows with the number of buses.
- **Newton-Raphson:** linearises the power equations and solves $\begin{bmatrix}\Delta P\\\Delta Q\end{bmatrix}=J\begin{bmatrix}\Delta\delta\\\Delta|V|\end{bmatrix}$ with the Jacobian $J$.
- **Newton-Raphson convergence:** quadratic, so it usually converges in 3 to 5 iterations, independent of system size.
- **Choice:** Newton-Raphson is preferred for large systems because each iteration costs more but far fewer are needed.

## Q6. State the swing equation and explain the equal area criterion. Derive the critical clearing angle. <small>(10 marks · Module 1 · Mid Sem)</small>

- **Swing equation:** $\dfrac{H}{\pi f}\dfrac{d^2\delta}{dt^2}=P_m-P_e$, where $H$ is the inertia constant in MJ/MVA.
- **Power-angle:** $P_e=P_{max}\sin\delta$.
- **Meaning:** if $P_m>P_e$ the rotor accelerates, and if $P_m<P_e$ it decelerates.
- **Stability idea:** after a fault the rotor must be able to swing back before it loses synchronism.
- **Equal area criterion:** the system is stable if the accelerating area $A_1$ equals the decelerating area $A_2$.
- **Accelerating area:** $A_1=\int_{\delta_0}^{\delta_c}(P_m-P_e)\,d\delta$, during the fault.
- **Decelerating area:** $A_2=\int_{\delta_c}^{\delta_{max}}(P_e-P_m)\,d\delta$, after the fault is cleared.
- **Critical clearing angle:** for a fault with $P_e=0$ during the fault, setting $A_1=A_2$ with $\delta_{max}=\pi-\delta_0$ gives $\cos\delta_{cr}=\dfrac{P_m}{P_{max}}(\pi-2\delta_0)-\cos\delta_0$.
- **Critical clearing time:** the time taken to reach $\delta_{cr}$. The fault must be cleared before this.
- **Use:** circuit breakers are chosen to clear faults faster than the critical clearing time.

## Q7. Explain overcurrent, differential and distance protection. <small>(5 marks · Module 1 · Mid Sem)</small>

- **Overcurrent:** the relay operates when the current exceeds a set value. It is simple and used on feeders, with time grading for coordination.
- **Differential:** compares currents entering and leaving the protected zone. It operates when the difference exceeds a threshold, which means an internal fault.
- **Differential use:** it is very selective and is used for transformers, generators and busbars.
- **Distance:** measures the impedance $V/I$ seen by the relay. A fault makes it fall below the set reach.
- **Distance use:** the reach does not depend on source strength, so it is used on transmission lines, with zones 1, 2 and 3.

## Q8. Describe the types of circuit breakers and how the arc is extinguished. <small>(5 marks · Module 1 · Mid Sem)</small>

- **Function:** a circuit breaker opens a circuit under fault and must interrupt the arc.
- **Arc extinction:** the arc is extinguished at a current zero, by cooling it and raising the dielectric strength of the gap faster than the recovery voltage.
- **Air-blast:** a high pressure air blast blows the arc away and cools it.
- **SF6:** the gas has high dielectric strength and absorbs free electrons, so it is used for high voltages.
- **Vacuum:** there is almost no medium to ionise, so the arc dies quickly. It is common at medium voltage.

## Q9. How are frequency and voltage controlled in a power system? <small>(2 marks · Module 1 · Mid Sem)</small>

- **Frequency:** it follows the real power balance, so it is controlled by governors and automatic generation control.
- **Voltage:** it follows reactive power, so it is controlled by capacitor banks, tap changing transformers, synchronous condensers and generator excitation.

## Q10. A load of 100 kW at 0.8 power factor lagging is to be improved to 0.95. Find the capacitor kVAR required. <small>(5 marks · Module 1 · Mid Sem)</small>

- **Formula:** $Q_c=P(\tan\phi_1-\tan\phi_2)$.
- **Initial angle:** $\cos\phi_1=0.8$, so $\tan\phi_1=0.75$.
- **Final angle:** $\cos\phi_2=0.95$, so $\tan\phi_2=0.329$.
- **Calculation:** $Q_c=100(0.75-0.329)$.
- **Answer:** $Q_c\approx42.1$ kVAR.

## Q11. What is the operator $a$ and what are $1+a+a^2$ and $a^3$? <small>(2 marks · Module 1 · Mid Sem)</small>

- **Definition:** $a=1\angle120^\circ=-0.5+j0.866$, and $a^2=1\angle240^\circ$.
- **Properties:** $1+a+a^2=0$ and $a^3=1$.

## Q12. Which fault is the most common and which is the most severe? <small>(2 marks · Module 1 · Mid Sem)</small>

- **Most common:** the single line-to-ground fault, roughly 70 to 80 percent of faults.
- **Most severe:** the symmetrical 3-phase fault, which usually gives the highest fault current, and it is used to size breakers.

## Q13. What is critical clearing time? <small>(2 marks · Module 1 · Mid Sem)</small>

- **Definition:** the maximum time a fault can stay on the system before the generator loses synchronism.
- **Use:** faults must be cleared faster than this for the system to remain stable.

## Q14. Why is the Y-bus matrix sparse? <small>(2 marks · Module 1 · Mid Sem)</small>

- **Reason:** each bus is connected to only a few other buses, so most off-diagonal entries are zero.
- **Benefit:** sparsity techniques save memory and time in load flow studies.

## Q15. What does a delta winding do to zero sequence currents? <small>(2 marks · Module 1 · Mid Sem)</small>

- **Trapping:** zero sequence currents circulate inside a delta winding and cannot flow in the lines outside it.
- **Effect:** the delta isolates the zero sequence network of the two sides of a transformer.

## Q16. Derive the output voltages of the buck, boost and buck-boost converters. <small>(10 marks · Module 2 · Mid Sem)</small>

- **Method:** in steady state the average inductor voltage over one period is zero (volt-second balance).
- **Duty ratio:** $D=t_{on}/T$, where the switch is on for $t_{on}$.
- **Buck, switch on:** $V_L=V_s-V_o$, for time $DT$.
- **Buck, switch off:** $V_L=-V_o$, for time $(1-D)T$.
- **Buck result:** balancing gives $V_o=DV_s$, so it only steps down.
- **Boost, switch on:** $V_L=V_s$, for time $DT$.
- **Boost, switch off:** $V_L=V_s-V_o$, for time $(1-D)T$.
- **Boost result:** $V_o=\dfrac{V_s}{1-D}$, so it only steps up.
- **Buck-boost:** $V_L=V_s$ when on and $V_L=V_o$ when off, so $V_o=-\dfrac{D}{1-D}V_s$.
- **Buck-boost result:** the output is inverted and can be higher or lower than the input.

## Q17. A buck converter has $V_s=24$ V, $V_o=12$ V, $L=100\ \mu$H and $f=50$ kHz. Find $D$ and the inductor ripple current. <small>(5 marks · Module 2 · Mid Sem)</small>

- **Duty ratio:** $D=V_o/V_s=12/24=0.5$.
- **Ripple formula:** $\Delta I_L=\dfrac{(V_s-V_o)D}{fL}$.
- **Substitution:** $\Delta I_L=\dfrac{(24-12)\times0.5}{50\times10^3\times100\times10^{-6}}=\dfrac{6}{5}$.
- **Answer:** the ripple current is $1.2$ A peak to peak.
- **Boost check:** a boost with $V_s=12$ V and $D=0.6$ gives $V_o=12/0.4=30$ V.

## Q18. Derive the average output voltage of a single-phase fully controlled bridge rectifier with a highly inductive load. Find it for $V_m=325$ V and $\alpha=60^\circ$. <small>(5 marks · Module 2 · Mid Sem)</small>

- **Setup:** each pair of thyristors conducts for 180° starting at the firing angle $\alpha$.
- **Integration:** $V_{dc}=\dfrac1\pi\int_\alpha^{\pi+\alpha}V_m\sin\omega t\,d(\omega t)$.
- **Result:** $V_{dc}=\dfrac{2V_m}{\pi}\cos\alpha$.
- **Numerical:** $V_{dc}=\dfrac{2\times325}{\pi}\cos60^\circ=\dfrac{325}{\pi}$.
- **Answer:** $V_{dc}\approx103.4$ V. For $\alpha>90^\circ$ the output is negative, so the converter works as an inverter.

## Q19. Find the average output of a three-phase uncontrolled bridge rectifier fed from a 415 V line-to-line supply. <small>(5 marks · Module 2 · Mid Sem)</small>

- **Formula:** $V_{dc}=\dfrac{3\sqrt2}{\pi}V_{LL}\approx1.35\,V_{LL}$.
- **Source:** it comes from averaging the highest line-to-line voltage over each 60° interval.
- **Substitution:** $V_{dc}=1.35\times415$.
- **Answer:** $V_{dc}\approx560$ V.
- **Controlled version:** for a fully controlled bridge multiply by $\cos\alpha$.

## Q20. Compare the thyristor, TRIAC, GTO, MOSFET and IGBT. <small>(5 marks · Module 2 · Mid Sem)</small>

- **Thyristor:** latches on after a gate pulse and turns off only when the current falls to zero. It is used for high power.
- **TRIAC:** a bidirectional thyristor used for AC control such as dimmers.
- **GTO:** a thyristor that can also be turned off by a negative gate pulse, at high power.
- **MOSFET:** voltage-controlled and very fast, used up to a few hundred volts and high frequencies.
- **IGBT:** combines MOSFET gate drive with bipolar conduction, and is widely used for medium voltage and power in inverters.

## Q21. Explain the single-phase full-bridge inverter and sinusoidal PWM. <small>(10 marks · Module 2 · Mid Sem)</small>

- **Circuit:** four switches in two legs, with an anti-parallel diode across each, supplied from a DC source $V_{dc}$.
- **Square wave:** switching diagonal pairs in turn gives an output of $\pm V_{dc}$.
- **Square wave fundamental:** its peak is $\dfrac{4V_{dc}}{\pi}$, with large low-order harmonics.
- **Sinusoidal PWM:** compare a sinusoidal reference with a high frequency triangular carrier to set the switching instants.
- **Rule:** a switch is on when the reference is above the carrier, so the pulse widths vary sinusoidally.
- **Amplitude modulation index:** $m_a=\dfrac{V_{ref}}{V_{carrier}}$.
- **Linear range:** for $m_a\le1$ the fundamental output peak is $m_aV_{dc}$.
- **Frequency modulation ratio:** $m_f=\dfrac{f_{carrier}}{f_{ref}}$.
- **Harmonics:** they move to around multiples of the carrier frequency, so a small filter removes them.
- **Three-phase:** use three references 120° apart with a common carrier, and the lines see balanced voltages.

## Q22. Define the power factor, distortion factor and THD of an AC to DC converter. <small>(5 marks · Module 2 · Mid Sem)</small>

- **Power factor:** $PF=\dfrac{P}{VI_{rms}}=DF\cdot\cos\phi_1$.
- **Distortion factor:** $DF=\dfrac{I_1}{I_{rms}}$, the ratio of the fundamental to the total rms current.
- **Displacement angle:** $\phi_1$ is the angle between the fundamental current and the voltage.
- **THD:** $THD=\dfrac{\sqrt{I_{rms}^2-I_1^2}}{I_1}$, and $DF=\dfrac1{\sqrt{1+THD^2}}$.
- **Effect:** line commutated converters draw non-sinusoidal current, so the power factor drops even if $\cos\phi_1$ is 1.

## Q23. Differentiate latching current and holding current of a thyristor. <small>(2 marks · Module 2 · Mid Sem)</small>

- **Latching current:** the minimum anode current needed to keep the thyristor on right after the gate pulse is removed.
- **Holding current:** the minimum anode current below which an already conducting thyristor turns off. It is lower than the latching current.

## Q24. Which of the devices can be turned off by the gate? <small>(2 marks · Module 2 · Mid Sem)</small>

- **Gate turn-off devices:** GTO, MOSFET and IGBT, plus the BJT.
- **Not gate-turn-off:** a thyristor and a TRIAC turn off only when the current falls to zero.

## Q25. What is the purpose of a freewheeling diode? <small>(2 marks · Module 2 · Mid Sem)</small>

- **Path:** it gives the inductive load current a path when the switch or rectifier output goes to zero.
- **Benefit:** it prevents voltage spikes and improves the output waveform and power factor.

## Q26. What is the range of duty ratio of the boost converter and why must $D<1$? <small>(2 marks · Module 2 · Mid Sem)</small>

- **Range:** $0\le D<1$, and the gain is $1/(1-D)$.
- **Limit:** as $D\to1$ the ideal gain goes to infinity, but real losses keep the practical limit at about $D<0.8$.

## Q27. What is the difference between a line commutated converter and a self commutated converter? <small>(2 marks · Module 2 · Mid Sem)</small>

- **Line commutated:** the AC supply voltage turns the thyristors off, as in controlled rectifiers.
- **Self commutated:** the devices turn off by their own gate control, as in IGBT inverters and choppers.
