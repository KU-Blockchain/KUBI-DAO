import { BigInt } from "@graphprotocol/graph-ts"
import {
  KubidVoting,
  NewProposal,
  Voted,
  PollOptionNames
} from "../generated/KubidVoting/KubidVoting"
import { Proposal, PollOption, Vote } from "../generated/schema"

export function handleNewProposal(event: NewProposal): void {
  let proposal = new Proposal(event.params.proposalId.toString())
  proposal.name = event.params.name
  proposal.description = event.params.description
  proposal.execution = event.params.execution
  proposal.totalVotes = BigInt.fromI32(0)
  proposal.timeInMinutes = BigInt.fromI32(event.params.timeInMinutes)
  proposal.creationTimestamp = event.block.timestamp
  proposal.save()
}

export function handleVoted(event: Voted): void {
  let vote = new Vote(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  vote.proposal = event.params.proposalId.toString()
  vote.voter = event.params.voter
  vote.optionIndex = BigInt.fromI32(event.params.optionIndex)
  vote.save()
}

export function handlePollOptionNames(event: PollOptionNames): void {
  let optionId = event.params.proposalId.toString() + "-" + event.params.optionIndex.toString()
  let option = new PollOption(optionId)
  option.proposal = event.params.proposalId.toString()
  option.optionIndex = BigInt.fromI32(event.params.optionIndex)
  option.name = event.params.name
  option.votes = BigInt.fromI32(0)
  option.save()
}
