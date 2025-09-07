using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class MessageHub(IMessageRepository messageRepository, IMemberRepository memberRepository) : Hub
{
    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var otherUser = httpContext?.Request?.Query["userId"].ToString()
                        ?? throw new HubException("Other user not found");
        var groupName = GetGroupName(GetUserId(), otherUser);
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

        var messages = await messageRepository.GetMessageThread(GetUserId(), otherUser);

        await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);
    }

    public async Task SendMessage(CreateMessageDto createMessageDto)
    {
        var sender = await memberRepository.GetMemberByIdAsync(GetUserId());
        var recipient = await memberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);

        if (recipient == null || sender == null || sender.Id == createMessageDto.RecipientId)
            throw new HubException("Cannot send message");

        var message = new Message
        {
            SenderId = sender.Id,
            RecipientId = recipient.Id,
            Content = createMessageDto.Content
        };

        var groupName = GetGroupName(sender.Id, recipient.Id);
        var group = await messageRepository.GetMessageGroup(groupName);
        var userInGroup = group != null && group.Connections.Any(x =>
            x.UserId == message.RecipientId);

        if (userInGroup)
        {
            message.DateRead = DateTime.UtcNow;
        }

        messageRepository.AddMessage(message);
    }

    private static string GetGroupName(string? caller, string? other)
    {
        var stringCompare = string.CompareOrdinal(caller, other) < 0;
        return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
    }

    private string GetUserId()
    {
        return Context.User?.GetMemberId()
               ?? throw new HubException("Cannot get member id");
    }
}