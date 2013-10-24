#! /usr/bin/env Rscript

args <- commandArgs(TRUE)
dfrm <- read.csv(args[1])
columns <- factor(colnames(dfrm))
colors <- c("red", "blue", "green")
lines <- c("solid", "solid")

quartz("Ponte")
matplot(dfrm, type="l", pch=as.integer(columns),
        col=colors, lty=lines,
        xlab=args[2], ylab=args[3],
        lwd=5,
        cex.lab=1.5,
        cex.axis=1.5,
        cex.main=1.5,
        cex.sub=1.5
        )

grid()
legend(as.integer(args[4]), as.integer(args[5]),
       as.character(columns),
       col=colors, lty=lines)

dev.copy(pdf,args[6])
dev.off()

#message("Press Return To Continue")
#invisible(readLines("stdin", n=1))
