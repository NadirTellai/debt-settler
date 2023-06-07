import React from "react";
import balances from '../../assests/how-does-it-work/balances.png'
import balances2 from '../../assests/how-does-it-work/balances-2.png'
import firstOptimization from '../../assests/how-does-it-work/first-optimization.png'
import secondOptimization from '../../assests/how-does-it-work/second-optimization.png'
import solution from '../../assests/how-does-it-work/solution.png'
import {Card, Typography} from "antd";
import "./styles.css"

const { Title, Paragraph } = Typography;
const HowDoesItWork: React.FC = ()=>{
    return (
        <Card className="container">
            <Typography>
                <Title style={{ textAlign: "center" }}>How the debt settler app works?</Title>
                <Paragraph>
                    Settling debts among a group of friends is a common problem, it happens when a member of a group pays for something
                    on behalf of everyone or some members of the group. While the most natural way of solving this problem is to
                    settle debts after every transaction, it can be very inconvenient.
                </Paragraph>
                <Paragraph>
                    The Debt Settler app offers a simple way to solve this problem by keeping track of all accumulated debts and
                    finding an optimized settlement. Instead of settling debts after each expense, the group can settle all debts
                    at once later on.
                </Paragraph>

                <Title level={2}>First Optimization</Title>
                <Paragraph>
                    Whenever there are more than one transaction between two members, we add them together if they are of the same
                    direction. If they are of opposite directions, we subtract the smaller from the larger.
                </Paragraph>
                <img src={firstOptimization} alt="First optimization" />

                <Title level={2}>Second Optimization</Title>
                <Paragraph>
                    We ignore all transactions and focus on the net balance of each person: the total amount lent to others minus
                    the total amount borrowed from others.
                </Paragraph>
                <img src={secondOptimization} alt="Second optimization" />
                <Paragraph>
                    First, if there are opposite balances, we settle them, record the transaction, and remove the members. Then we
                    sort the remaining members by balance from largest to smallest. We notice that the sum of the positive balances
                    is the opposite of the sum of the negative ones, and we need to transfer money from the top to the bottom.
                </Paragraph>
                <img src={balances} alt="Balances" />

                <Paragraph>
                    We start with the largest possible transaction, which is between the top and bottom members. One of them will
                    have a balance of zero, and they are out.
                </Paragraph>
                <img src={balances2} alt="Balances 2" />

                <Paragraph>
                    We repeat the process for the remaining members, each time taking out one member. In the final transaction,
                    members will finish, for a total of n-1 transactions, where n is the number of members in the group (six in
                    this case).
                </Paragraph>
                <img src={solution} alt="Solution" />

                <Title level={2}>More Efficient Solution</Title>

                <Paragraph>
                    We know that any group of n members with zero-sum debt among themselves can always settle in n-1 transactions.
                    If there are m sub-groups with zero-sum debt, then we can settle in n-m transactions. The more zero-sum
                    sub-groups we can find, the fewer transactions we need to settle all the debt. But finding zero-sum sub groups is a NP-complete
                    problem.
                    <br />
                    <blockquote>
                            Although a solution to an NP-complete problem can be verified
                            quickly, there is no known way to find a solution quickly. That is,
                            the time required to solve the problem using any currently known
                            algorithm increases rapidly as the size of the problem grows
                    </blockquote>
                    <a href="https://en.wikipedia.org/wiki/NP-completeness">-Wikipedia</a>

                </Paragraph>
            </Typography>
        </Card>
    );

}
export default HowDoesItWork