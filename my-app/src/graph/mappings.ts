import { BigInt } from "@graphprotocol/graph-ts"
import {
  KubidVoting,
  NewProposal,
  Voted,
  PollOptionNames,
  WinnerAnnounced
} from "./generated/KubidVoting/KubidVoting"
import { Proposal, PollOption, Vote } from "./generated/schema"

export function handleNewProposal(event: NewProposal): void {
  let proposal = new Proposal(event.params.proposalId.toString())
  proposal.name = event.params.name
  proposal.description = event.params.description
  proposal.execution = event.params.execution
  proposal.totalVotes = BigInt.fromI32(0)
  proposal.timeInMinutes = event.params.timeInMinutes 
  proposal.creationTimestamp = event.block.timestamp
  proposal.expirationTimestamp = event.block.timestamp.plus(proposal.timeInMinutes.times(BigInt.fromI32(60)));
  proposal.winnerName = null;
  proposal.save()
}

export function handleVoted(event: Voted): void {
  let vote = new Vote(event.transaction.hash.toHex() + "-" + event.logIndex.toString())
  vote.proposal = event.params.proposalId.toString()
  vote.voter = event.params.voter
  vote.optionIndex = event.params.optionIndex 
  vote.save()

    let proposal = Proposal.load(event.params.proposalId.toString())
    if (proposal == null) return;
    proposal.totalVotes = proposal.totalVotes.plus(BigInt.fromI32(1))
    proposal.save()

    //load option
    let optionId = event.params.proposalId.toString() + "-" + event.params.optionIndex.toString()
    let option = PollOption.load(optionId)
    if (option == null) return;

    option.votes = option.votes.plus(BigInt.fromI32(1))
    option.save()

}

export function handlePollOptionNames(event: PollOptionNames): void {
  let optionId = event.params.proposalId.toString() + "-" + event.params.optionIndex.toString()
  let option = new PollOption(optionId)
  option.proposal = event.params.proposalId.toString()
  option.optionIndex = event.params.optionIndex 
  option.name = event.params.name
  option.votes = BigInt.fromI32(0)
  option.save()
}

export function handleWinnerAnnounced(event: WinnerAnnounced): void {
    let proposalId = event.params.proposalId.toString();
    let proposal = Proposal.load(proposalId);
    if (proposal == null) return;
  
    let winningOptionIndex = event.params.winningOptionIndex;
    let optionId = proposalId + "-" + winningOptionIndex.toString();
    let option = PollOption.load(optionId);
    if (option == null) return;
  
    proposal.winnerName = option.name;
    proposal.save();
  }
  
